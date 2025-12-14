"""
Tests for project endpoints.
"""

import pytest


class TestProjectCreation:
    """Tests for project creation endpoint."""
    
    def test_create_project_success(self, client, auth_token, test_project_data):
        """Test successful project creation."""
        response = client.post(
            "/projects/",
            json=test_project_data,
            params={"token": auth_token}
        )
        
        assert response.status_code == 200
        data = response.json()
        assert data["title"] == test_project_data["title"]
        assert data["description"] == test_project_data["description"]
        assert data["project_url"] == test_project_data["project_url"]
        assert "id" in data
        assert "created_at" in data
    
    def test_create_project_unauthorized(self, client, test_project_data):
        """Test project creation without auth fails."""
        response = client.post(
            "/projects/",
            json=test_project_data,
            params={"token": "invalid-token"}
        )
        
        assert response.status_code == 401


class TestGetProjects:
    """Tests for getting projects endpoint."""
    
    def test_get_projects_empty(self, client):
        """Test getting projects when none exist."""
        response = client.get("/projects/")
        
        assert response.status_code == 200
        assert response.json() == []
    
    def test_get_projects_with_data(self, client, auth_token, test_project_data):
        """Test getting projects after creation."""
        client.post(
            "/projects/",
            json=test_project_data,
            params={"token": auth_token}
        )
        
        response = client.get("/projects/")
        
        assert response.status_code == 200
        projects = response.json()
        assert len(projects) == 1
        assert projects[0]["title"] == test_project_data["title"]
        assert "username" in projects[0]
        assert "likes_count" in projects[0]
        assert "reviews_count" in projects[0]


class TestGetMyProjects:
    """Tests for getting user's own projects."""
    
    def test_get_my_projects(self, client, auth_token, test_project_data):
        """Test getting own projects."""
        client.post(
            "/projects/",
            json=test_project_data,
            params={"token": auth_token}
        )
        
        response = client.get("/projects/my", params={"token": auth_token})
        
        assert response.status_code == 200
        projects = response.json()
        assert len(projects) == 1
    
    def test_get_my_projects_unauthorized(self, client):
        """Test getting own projects without auth fails."""
        response = client.get("/projects/my", params={"token": "invalid"})
        
        assert response.status_code == 401


class TestProjectLikes:
    """Tests for project like functionality."""
    
    def test_like_project(self, client, auth_token, test_project_data):
        """Test liking a project."""
        create_response = client.post(
            "/projects/",
            json=test_project_data,
            params={"token": auth_token}
        )
        project_id = create_response.json()["id"]
        
        like_response = client.post(
            f"/projects/{project_id}/like",
            params={"token": auth_token}
        )
        
        assert like_response.status_code == 200
        assert like_response.json()["project_id"] == project_id
    
    def test_like_project_twice_fails(self, client, auth_token, test_project_data):
        """Test liking same project twice fails."""
        create_response = client.post(
            "/projects/",
            json=test_project_data,
            params={"token": auth_token}
        )
        project_id = create_response.json()["id"]
        
        client.post(f"/projects/{project_id}/like", params={"token": auth_token})
        second_response = client.post(
            f"/projects/{project_id}/like",
            params={"token": auth_token}
        )
        
        assert second_response.status_code == 400
        assert "Already liked" in second_response.json()["detail"]
    
    def test_unlike_project(self, client, auth_token, test_project_data):
        """Test unliking a project."""
        create_response = client.post(
            "/projects/",
            json=test_project_data,
            params={"token": auth_token}
        )
        project_id = create_response.json()["id"]
        
        client.post(f"/projects/{project_id}/like", params={"token": auth_token})
        unlike_response = client.delete(
            f"/projects/{project_id}/like",
            params={"token": auth_token}
        )
        
        assert unlike_response.status_code == 200
    
    def test_check_liked_status(self, client, auth_token, test_project_data):
        """Test checking if project is liked."""
        create_response = client.post(
            "/projects/",
            json=test_project_data,
            params={"token": auth_token}
        )
        project_id = create_response.json()["id"]
        
        not_liked = client.get(
            f"/projects/{project_id}/liked",
            params={"token": auth_token}
        )
        assert not_liked.json() is False
        
        client.post(f"/projects/{project_id}/like", params={"token": auth_token})
        
        liked = client.get(
            f"/projects/{project_id}/liked",
            params={"token": auth_token}
        )
        assert liked.json() is True


class TestProjectReviews:
    """Tests for project review functionality."""
    
    def test_create_review(self, client, auth_token, test_project_data):
        """Test creating a review."""
        create_response = client.post(
            "/projects/",
            json=test_project_data,
            params={"token": auth_token}
        )
        project_id = create_response.json()["id"]
        
        review_data = {"content": "Great project!", "rating": 5}
        review_response = client.post(
            f"/projects/{project_id}/review",
            json=review_data,
            params={"token": auth_token}
        )
        
        assert review_response.status_code == 200
        assert review_response.json()["content"] == "Great project!"
        assert review_response.json()["rating"] == 5
    
    def test_create_review_invalid_rating(self, client, auth_token, test_project_data):
        """Test creating review with invalid rating fails."""
        create_response = client.post(
            "/projects/",
            json=test_project_data,
            params={"token": auth_token}
        )
        project_id = create_response.json()["id"]
        
        review_data = {"content": "Test", "rating": 6}
        review_response = client.post(
            f"/projects/{project_id}/review",
            json=review_data,
            params={"token": auth_token}
        )
        
        assert review_response.status_code == 422
    
    def test_get_project_reviews(self, client, auth_token, test_project_data):
        """Test getting reviews for a project."""
        create_response = client.post(
            "/projects/",
            json=test_project_data,
            params={"token": auth_token}
        )
        project_id = create_response.json()["id"]
        
        review_data = {"content": "Nice work!", "rating": 4}
        client.post(
            f"/projects/{project_id}/review",
            json=review_data,
            params={"token": auth_token}
        )
        
        reviews_response = client.get(f"/projects/{project_id}/reviews")
        
        assert reviews_response.status_code == 200
        reviews = reviews_response.json()
        assert len(reviews) == 1
        assert reviews[0]["content"] == "Nice work!"


class TestAnalytics:
    """Tests for analytics endpoint."""
    
    def test_get_analytics_empty(self, client):
        """Test analytics with no data."""
        response = client.get("/projects/analytics/top")
        
        assert response.status_code == 200
        data = response.json()
        assert data["total_projects"] == 0
        assert data["total_likes"] == 0
        assert data["total_reviews"] == 0
        assert data["top_projects"] == []
    
    def test_get_analytics_with_data(self, client, auth_token, test_project_data):
        """Test analytics with projects."""
        client.post(
            "/projects/",
            json=test_project_data,
            params={"token": auth_token}
        )
        
        response = client.get("/projects/analytics/top")
        
        assert response.status_code == 200
        data = response.json()
        assert data["total_projects"] == 1
        assert len(data["top_projects"]) == 1

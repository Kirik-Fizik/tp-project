"""
Tests for authentication endpoints.
"""

import pytest


class TestUserRegistration:
    """Tests for user registration endpoint."""
    
    def test_register_success(self, client, test_user_data):
        """Test successful user registration."""
        response = client.post("/auth/register", json=test_user_data)
        
        assert response.status_code == 200
        data = response.json()
        assert data["email"] == test_user_data["email"]
        assert data["username"] == test_user_data["username"]
        assert "id" in data
        assert "created_at" in data
        assert "password" not in data
    
    def test_register_duplicate_email(self, client, test_user_data, registered_user):
        """Test registration with duplicate email fails."""
        duplicate_user = {
            "email": test_user_data["email"],
            "username": "differentuser",
            "password": "password123"
        }
        response = client.post("/auth/register", json=duplicate_user)
        
        assert response.status_code == 400
        assert "Email already registered" in response.json()["detail"]
    
    def test_register_duplicate_username(self, client, test_user_data, registered_user):
        """Test registration with duplicate username fails."""
        duplicate_user = {
            "email": "different@example.com",
            "username": test_user_data["username"],
            "password": "password123"
        }
        response = client.post("/auth/register", json=duplicate_user)
        
        assert response.status_code == 400
        assert "Username already taken" in response.json()["detail"]
    
    def test_register_invalid_email(self, client):
        """Test registration with invalid email fails."""
        invalid_user = {
            "email": "not-an-email",
            "username": "testuser",
            "password": "password123"
        }
        response = client.post("/auth/register", json=invalid_user)
        
        assert response.status_code == 422


class TestUserLogin:
    """Tests for user login endpoint."""
    
    def test_login_success(self, client, test_user_data, registered_user):
        """Test successful login returns token."""
        login_data = {
            "username": test_user_data["username"],
            "password": test_user_data["password"]
        }
        response = client.post("/auth/login", json=login_data)
        
        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert data["token_type"] == "bearer"
    
    def test_login_wrong_password(self, client, test_user_data, registered_user):
        """Test login with wrong password fails."""
        login_data = {
            "username": test_user_data["username"],
            "password": "wrongpassword"
        }
        response = client.post("/auth/login", json=login_data)
        
        assert response.status_code == 401
        assert "Incorrect username or password" in response.json()["detail"]
    
    def test_login_nonexistent_user(self, client):
        """Test login with non-existent user fails."""
        login_data = {
            "username": "nonexistent",
            "password": "password123"
        }
        response = client.post("/auth/login", json=login_data)
        
        assert response.status_code == 401


class TestGetCurrentUser:
    """Tests for get current user endpoint."""
    
    def test_get_current_user_success(self, client, test_user_data, auth_token):
        """Test getting current user with valid token."""
        response = client.get("/auth/me", params={"token": auth_token})
        
        assert response.status_code == 200
        data = response.json()
        assert data["username"] == test_user_data["username"]
        assert data["email"] == test_user_data["email"]
    
    def test_get_current_user_invalid_token(self, client):
        """Test getting current user with invalid token fails."""
        response = client.get("/auth/me", params={"token": "invalid-token"})
        
        assert response.status_code == 401
        assert "Invalid token" in response.json()["detail"]

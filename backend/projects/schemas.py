"""
Pydantic schemas for projects, likes, and reviews.

Contains request and response models for project-related endpoints.
"""

from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, ConfigDict, field_validator


class ProjectBase(BaseModel):
    """Base project schema with common fields."""
    
    title: str
    description: str
    project_url: str


class ProjectCreate(ProjectBase):
    """Schema for project creation request."""
    
    pass


class ProjectResponse(ProjectBase):
    """Schema for project data in API responses."""
    
    model_config = ConfigDict(from_attributes=True)
    
    id: int
    user_id: int
    created_at: datetime


class ProjectWithUser(ProjectResponse):
    """Schema for project with owner username."""
    
    username: str
    likes_count: int = 0
    reviews_count: int = 0


class LikeCreate(BaseModel):
    """Schema for like creation request."""
    
    project_id: int


class LikeResponse(BaseModel):
    """Schema for like data in API responses."""
    
    model_config = ConfigDict(from_attributes=True)
    
    id: int
    user_id: int
    project_id: int
    created_at: datetime


class ReviewBase(BaseModel):
    """Base review schema with common fields."""
    
    content: str
    rating: int
    
    @field_validator('rating')
    @classmethod
    def validate_rating(cls, v: int) -> int:
        """Validate rating is between 1 and 5."""
        if v < 1 or v > 5:
            raise ValueError('Rating must be between 1 and 5')
        return v


class ReviewCreate(ReviewBase):
    """Schema for review creation request."""
    
    project_id: int


class ReviewResponse(ReviewBase):
    """Schema for review data in API responses."""
    
    model_config = ConfigDict(from_attributes=True)
    
    id: int
    user_id: int
    project_id: int
    created_at: datetime
    username: Optional[str] = None


class AnalyticsResponse(BaseModel):
    """Schema for analytics data response."""
    
    top_projects: List[ProjectWithUser]
    total_projects: int
    total_likes: int
    total_reviews: int

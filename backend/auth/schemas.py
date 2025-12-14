"""
Pydantic schemas for user authentication.

Contains request and response models for auth endpoints.
"""

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr, ConfigDict


class UserBase(BaseModel):
    """Base user schema with common fields."""
    
    email: EmailStr
    username: str


class UserCreate(UserBase):
    """Schema for user registration request."""
    
    password: str


class UserLogin(BaseModel):
    """Schema for user login request."""
    
    username: str
    password: str


class UserResponse(UserBase):
    """Schema for user data in API responses."""
    
    model_config = ConfigDict(from_attributes=True)
    
    id: int
    is_active: bool
    created_at: datetime


class Token(BaseModel):
    """Schema for JWT token response."""
    
    access_token: str
    token_type: str


class TokenData(BaseModel):
    """Schema for decoded JWT token data."""
    
    username: Optional[str] = None

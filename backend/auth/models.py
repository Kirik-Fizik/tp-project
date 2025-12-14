"""
User authentication models.

Contains SQLAlchemy ORM models for user management.
"""

from datetime import datetime, timezone
from typing import TYPE_CHECKING, List

from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.orm import relationship, Mapped

from database.connection import Base

if TYPE_CHECKING:
    from projects.models import Project


class User(Base):
    """
    User model representing registered users on the platform.
    
    Attributes:
        id: Primary key identifier.
        email: Unique email address.
        username: Unique username for login.
        hashed_password: Argon2 hashed password.
        is_active: Flag indicating if user account is active.
        created_at: Timestamp of account creation.
        projects: Relationship to user's projects.
    """
    
    __tablename__ = "users"
    
    id: Mapped[int] = Column(Integer, primary_key=True, index=True)
    email: Mapped[str] = Column(String, unique=True, index=True, nullable=False)
    username: Mapped[str] = Column(String, unique=True, index=True, nullable=False)
    hashed_password: Mapped[str] = Column(String, nullable=False)
    is_active: Mapped[bool] = Column(Boolean, default=True)
    created_at: Mapped[datetime] = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    
    projects: Mapped[List["Project"]] = relationship("Project", back_populates="user")

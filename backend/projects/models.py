"""
Project and related models.

Contains SQLAlchemy ORM models for projects, likes, and reviews.
"""

from datetime import datetime, timezone
from typing import TYPE_CHECKING, List, Optional

from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship, Mapped

from database.connection import Base

if TYPE_CHECKING:
    from auth.models import User


class Project(Base):
    """
    Project model representing startup projects on the platform.
    
    Attributes:
        id: Primary key identifier.
        title: Project title.
        description: Detailed project description.
        project_url: Link to the project.
        user_id: Foreign key to owner user.
        created_at: Timestamp of project creation.
        user: Relationship to project owner.
        likes: Relationship to project likes.
        reviews: Relationship to project reviews.
    """
    
    __tablename__ = "projects"
    
    id: Mapped[int] = Column(Integer, primary_key=True, index=True)
    title: Mapped[str] = Column(String, nullable=False)
    description: Mapped[str] = Column(Text, nullable=False)
    project_url: Mapped[str] = Column(String, nullable=False)
    user_id: Mapped[int] = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at: Mapped[datetime] = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    
    user: Mapped["User"] = relationship("User", back_populates="projects")
    likes: Mapped[List["Like"]] = relationship("Like", back_populates="project", cascade="all, delete-orphan")
    reviews: Mapped[List["Review"]] = relationship("Review", back_populates="project", cascade="all, delete-orphan")


class Like(Base):
    """
    Like model for project likes/votes.
    
    Attributes:
        id: Primary key identifier.
        user_id: Foreign key to user who liked.
        project_id: Foreign key to liked project.
        created_at: Timestamp of like action.
    """
    
    __tablename__ = "likes"
    __table_args__ = (
        UniqueConstraint('user_id', 'project_id', name='unique_user_project_like'),
    )
    
    id: Mapped[int] = Column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = Column(Integer, ForeignKey("users.id"), nullable=False)
    project_id: Mapped[int] = Column(Integer, ForeignKey("projects.id"), nullable=False)
    created_at: Mapped[datetime] = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    
    user: Mapped["User"] = relationship("User")
    project: Mapped["Project"] = relationship("Project", back_populates="likes")


class Review(Base):
    """
    Review model for project reviews/comments.
    
    Attributes:
        id: Primary key identifier.
        user_id: Foreign key to reviewer.
        project_id: Foreign key to reviewed project.
        content: Review text content.
        rating: Rating score (1-5).
        created_at: Timestamp of review creation.
    """
    
    __tablename__ = "reviews"
    __table_args__ = (
        UniqueConstraint('user_id', 'project_id', name='unique_user_project_review'),
    )
    
    id: Mapped[int] = Column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = Column(Integer, ForeignKey("users.id"), nullable=False)
    project_id: Mapped[int] = Column(Integer, ForeignKey("projects.id"), nullable=False)
    content: Mapped[str] = Column(Text, nullable=False)
    rating: Mapped[int] = Column(Integer, nullable=False)
    created_at: Mapped[datetime] = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    
    user: Mapped["User"] = relationship("User")
    project: Mapped["Project"] = relationship("Project", back_populates="reviews")

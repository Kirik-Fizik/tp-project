"""
Projects router module.

Provides API endpoints for project CRUD, likes, reviews, and analytics.
"""

from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func
from sqlalchemy.orm import Session

from database.connection import get_db
from auth import utils, models as auth_models
from projects import models, schemas

router = APIRouter(prefix="/projects", tags=["projects"])


def get_authenticated_user(token: str, db: Session) -> auth_models.User:
    """
    Validate token and return authenticated user.
    
    Args:
        token: JWT access token.
        db: Database session.
    
    Returns:
        Authenticated user object.
    
    Raises:
        HTTPException: If token is invalid or user not found.
    """
    username: Optional[str] = utils.verify_token(token)
    if username is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )
    
    user = db.query(auth_models.User).filter(auth_models.User.username == username).first()
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    return user


@router.post("/", response_model=schemas.ProjectResponse)
def create_project(
    project: schemas.ProjectCreate,
    token: str,
    db: Session = Depends(get_db)
) -> schemas.ProjectResponse:
    """
    Create a new project.
    
    Args:
        project: Project data.
        token: JWT access token.
        db: Database session.
    
    Returns:
        Created project data.
    """
    user = get_authenticated_user(token, db)
    
    db_project = models.Project(
        title=project.title,
        description=project.description,
        project_url=project.project_url,
        user_id=user.id
    )
    
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    
    return schemas.ProjectResponse(
        id=db_project.id,
        title=db_project.title,
        description=db_project.description,
        project_url=db_project.project_url,
        user_id=db_project.user_id,
        created_at=db_project.created_at
    )


@router.get("/", response_model=List[schemas.ProjectWithUser])
def get_projects(db: Session = Depends(get_db)) -> List[schemas.ProjectWithUser]:
    """
    Get all projects with user info and stats.
    
    Args:
        db: Database session.
    
    Returns:
        List of projects with owner username and counts.
    """
    projects = db.query(models.Project).join(auth_models.User).all()
    result: List[schemas.ProjectWithUser] = []
    for project in projects:
        likes_count = db.query(func.count(models.Like.id)).filter(
            models.Like.project_id == project.id
        ).scalar() or 0
        reviews_count = db.query(func.count(models.Review.id)).filter(
            models.Review.project_id == project.id
        ).scalar() or 0
        
        project_data = schemas.ProjectWithUser(
            id=project.id,
            title=project.title,
            description=project.description,
            project_url=project.project_url,
            user_id=project.user_id,
            created_at=project.created_at,
            username=project.user.username,
            likes_count=likes_count,
            reviews_count=reviews_count
        )
        result.append(project_data)
    return result


@router.get("/my", response_model=List[schemas.ProjectResponse])
def get_my_projects(token: str, db: Session = Depends(get_db)) -> List[schemas.ProjectResponse]:
    """
    Get current user's projects.
    
    Args:
        token: JWT access token.
        db: Database session.
    
    Returns:
        List of user's projects.
    """
    user = get_authenticated_user(token, db)
    
    projects = db.query(models.Project).filter(models.Project.user_id == user.id).all()
    result: List[schemas.ProjectResponse] = []
    for project in projects:
        project_data = schemas.ProjectResponse(
            id=project.id,
            title=project.title,
            description=project.description,
            project_url=project.project_url,
            user_id=project.user_id,
            created_at=project.created_at
        )
        result.append(project_data)
    return result


@router.get("/{project_id}", response_model=schemas.ProjectWithUser)
def get_project(project_id: int, db: Session = Depends(get_db)) -> schemas.ProjectWithUser:
    """
    Get a single project by ID.
    
    Args:
        project_id: Project ID.
        db: Database session.
    
    Returns:
        Project data with owner and stats.
    
    Raises:
        HTTPException: If project not found.
    """
    project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if project is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    likes_count = db.query(func.count(models.Like.id)).filter(
        models.Like.project_id == project.id
    ).scalar() or 0
    reviews_count = db.query(func.count(models.Review.id)).filter(
        models.Review.project_id == project.id
    ).scalar() or 0
    
    return schemas.ProjectWithUser(
        id=project.id,
        title=project.title,
        description=project.description,
        project_url=project.project_url,
        user_id=project.user_id,
        created_at=project.created_at,
        username=project.user.username,
        likes_count=likes_count,
        reviews_count=reviews_count
    )


@router.post("/{project_id}/like", response_model=schemas.LikeResponse)
def like_project(
    project_id: int,
    token: str,
    db: Session = Depends(get_db)
) -> schemas.LikeResponse:
    """
    Like a project.
    
    Args:
        project_id: Project ID to like.
        token: JWT access token.
        db: Database session.
    
    Returns:
        Created like data.
    
    Raises:
        HTTPException: If already liked or project not found.
    """
    user = get_authenticated_user(token, db)
    
    project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if project is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    existing_like = db.query(models.Like).filter(
        models.Like.user_id == user.id,
        models.Like.project_id == project_id
    ).first()
    
    if existing_like:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Already liked this project"
        )
    
    db_like = models.Like(user_id=user.id, project_id=project_id)
    db.add(db_like)
    db.commit()
    db.refresh(db_like)
    
    return schemas.LikeResponse(
        id=db_like.id,
        user_id=db_like.user_id,
        project_id=db_like.project_id,
        created_at=db_like.created_at
    )


@router.delete("/{project_id}/like")
def unlike_project(
    project_id: int,
    token: str,
    db: Session = Depends(get_db)
) -> dict:
    """
    Remove like from a project.
    
    Args:
        project_id: Project ID to unlike.
        token: JWT access token.
        db: Database session.
    
    Returns:
        Success message.
    
    Raises:
        HTTPException: If like not found.
    """
    user = get_authenticated_user(token, db)
    
    like = db.query(models.Like).filter(
        models.Like.user_id == user.id,
        models.Like.project_id == project_id
    ).first()
    
    if like is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Like not found"
        )
    
    db.delete(like)
    db.commit()
    
    return {"message": "Like removed successfully"}


@router.get("/{project_id}/liked", response_model=bool)
def check_liked(
    project_id: int,
    token: str,
    db: Session = Depends(get_db)
) -> bool:
    """
    Check if current user liked a project.
    
    Args:
        project_id: Project ID.
        token: JWT access token.
        db: Database session.
    
    Returns:
        True if liked, False otherwise.
    """
    user = get_authenticated_user(token, db)
    
    like = db.query(models.Like).filter(
        models.Like.user_id == user.id,
        models.Like.project_id == project_id
    ).first()
    
    return like is not None


@router.post("/{project_id}/review", response_model=schemas.ReviewResponse)
def create_review(
    project_id: int,
    review: schemas.ReviewBase,
    token: str,
    db: Session = Depends(get_db)
) -> schemas.ReviewResponse:
    """
    Create a review for a project.
    
    Args:
        project_id: Project ID to review.
        review: Review data.
        token: JWT access token.
        db: Database session.
    
    Returns:
        Created review data.
    
    Raises:
        HTTPException: If already reviewed or project not found.
    """
    user = get_authenticated_user(token, db)
    
    project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if project is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    existing_review = db.query(models.Review).filter(
        models.Review.user_id == user.id,
        models.Review.project_id == project_id
    ).first()
    
    if existing_review:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Already reviewed this project"
        )
    
    db_review = models.Review(
        user_id=user.id,
        project_id=project_id,
        content=review.content,
        rating=review.rating
    )
    db.add(db_review)
    db.commit()
    db.refresh(db_review)
    
    return schemas.ReviewResponse(
        id=db_review.id,
        user_id=db_review.user_id,
        project_id=db_review.project_id,
        content=db_review.content,
        rating=db_review.rating,
        created_at=db_review.created_at,
        username=user.username
    )


@router.get("/{project_id}/reviews", response_model=List[schemas.ReviewResponse])
def get_project_reviews(
    project_id: int,
    db: Session = Depends(get_db)
) -> List[schemas.ReviewResponse]:
    """
    Get all reviews for a project.
    
    Args:
        project_id: Project ID.
        db: Database session.
    
    Returns:
        List of reviews.
    """
    reviews = db.query(models.Review).filter(
        models.Review.project_id == project_id
    ).all()
    
    result: List[schemas.ReviewResponse] = []
    for review in reviews:
        result.append(schemas.ReviewResponse(
            id=review.id,
            user_id=review.user_id,
            project_id=review.project_id,
            content=review.content,
            rating=review.rating,
            created_at=review.created_at,
            username=review.user.username
        ))
    return result


@router.get("/analytics/top", response_model=schemas.AnalyticsResponse)
def get_analytics(db: Session = Depends(get_db)) -> schemas.AnalyticsResponse:
    """
    Get platform analytics with top projects.
    
    Args:
        db: Database session.
    
    Returns:
        Analytics data with top projects and totals.
    """
    projects_with_likes = db.query(
        models.Project,
        func.count(models.Like.id).label('likes_count')
    ).outerjoin(models.Like).group_by(models.Project.id).order_by(
        func.count(models.Like.id).desc()
    ).limit(10).all()
    
    top_projects: List[schemas.ProjectWithUser] = []
    for project, likes_count in projects_with_likes:
        reviews_count = db.query(func.count(models.Review.id)).filter(
            models.Review.project_id == project.id
        ).scalar() or 0
        
        top_projects.append(schemas.ProjectWithUser(
            id=project.id,
            title=project.title,
            description=project.description,
            project_url=project.project_url,
            user_id=project.user_id,
            created_at=project.created_at,
            username=project.user.username,
            likes_count=likes_count,
            reviews_count=reviews_count
        ))
    
    total_projects = db.query(func.count(models.Project.id)).scalar() or 0
    total_likes = db.query(func.count(models.Like.id)).scalar() or 0
    total_reviews = db.query(func.count(models.Review.id)).scalar() or 0
    
    return schemas.AnalyticsResponse(
        top_projects=top_projects,
        total_projects=total_projects,
        total_likes=total_likes,
        total_reviews=total_reviews
    )

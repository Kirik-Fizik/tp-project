from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from database.connection import get_db
from auth import utils, models as auth_models
from projects import models, schemas

router = APIRouter(prefix="/projects", tags=["projects"])

@router.post("/", response_model=schemas.ProjectResponse)
def create_project(
    project: schemas.ProjectCreate,
    token: str,
    db: Session = Depends(get_db)
):
    username = utils.verify_token(token)
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
def get_projects(db: Session = Depends(get_db)):
    projects = db.query(models.Project).join(auth_models.User).all()
    result = []
    for project in projects:
        project_data = schemas.ProjectWithUser(
            id=project.id,
            title=project.title,
            description=project.description,
            project_url=project.project_url,
            user_id=project.user_id,
            created_at=project.created_at,
            username=project.user.username
        )
        result.append(project_data)
    return result

@router.get("/my", response_model=List[schemas.ProjectResponse])
def get_my_projects(token: str, db: Session = Depends(get_db)):
    username = utils.verify_token(token)
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
    
    projects = db.query(models.Project).filter(models.Project.user_id == user.id).all()
    result = []
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
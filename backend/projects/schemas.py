from pydantic import BaseModel, HttpUrl
from datetime import datetime

class ProjectBase(BaseModel):
    title: str
    description: str
    project_url: str

class ProjectCreate(ProjectBase):
    pass

class ProjectResponse(ProjectBase):
    id: int
    user_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

class ProjectWithUser(ProjectResponse):
    username: str
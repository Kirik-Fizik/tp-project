"""
Main FastAPI application module.

Entry point for the Startup Platform API.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database.connection import engine, Base
from auth.router import router as auth_router
from projects.router import router as projects_router
from config import settings

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Startup Platform API",
    description="API for sharing and discovering startup projects",
    version="1.0.0",
    debug=settings.DEBUG
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(projects_router)


@app.get("/")
def read_root() -> dict:
    """
    Health check endpoint.
    
    Returns:
        Welcome message.
    """
    return {"message": "Startup Platform API is running!"}


@app.get("/health")
def health_check() -> dict:
    """
    Health check endpoint for monitoring.
    
    Returns:
        Health status.
    """
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.DEBUG
    )

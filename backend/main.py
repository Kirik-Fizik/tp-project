from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database.connection import engine, Base
from auth.router import router as auth_router
from projects.router import router as projects_router
from config import settings

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Startup Platform API", 
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
def read_root():
    return {"message": "Startup Platform API is running!"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        app, 
        host="0.0.0.0", 
        port=8000,
        reload=settings.DEBUG
    )
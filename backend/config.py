"""
Configuration module for the Startup Platform API.

This module handles all environment variable loading and application settings.
"""

import os
from typing import Optional
from dotenv import load_dotenv

load_dotenv()


class Settings:
    """
    Application settings loaded from environment variables.
    
    Attributes:
        DB_HOST: PostgreSQL database host address.
        DB_PORT: PostgreSQL database port.
        DB_NAME: Name of the database.
        DB_USER: Database username.
        DB_PASSWORD: Database password.
        SECRET_KEY: JWT secret key for token signing.
        ALGORITHM: JWT algorithm (default: HS256).
        ACCESS_TOKEN_EXPIRE_MINUTES: Token expiration time in minutes.
        DEBUG: Debug mode flag.
    """
    
    DB_HOST: str = os.getenv("PGHOST", os.getenv("DB_HOST", "localhost"))
    DB_PORT: str = os.getenv("PGPORT", os.getenv("DB_PORT", "5432"))
    DB_NAME: str = os.getenv("PGDATABASE", os.getenv("DB_NAME", "startup_db"))
    DB_USER: str = os.getenv("PGUSER", os.getenv("DB_USER", "postgres"))
    DB_PASSWORD: str = os.getenv("PGPASSWORD", os.getenv("DB_PASSWORD", ""))
    
    SECRET_KEY: str = os.getenv("SECRET_KEY", os.getenv("SESSION_SECRET", "fallback-secret-key"))
    ALGORITHM: str = os.getenv("ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))
    
    DEBUG: bool = os.getenv("DEBUG", "False").lower() == "true"
    
    @property
    def DATABASE_URL(self) -> str:
        """Construct and return the PostgreSQL connection URL."""
        env_url = os.getenv("DATABASE_URL")
        if env_url:
            return env_url
        return f"postgresql://{self.DB_USER}:{self.DB_PASSWORD}@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"


settings = Settings()

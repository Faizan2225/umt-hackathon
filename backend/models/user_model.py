# models/user_model.py
from beanie import Document
from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

class User(Document):
    name: str
    email: EmailStr
    password: str
    role: str = "seeker"  # seeker or finder
    skills: List[str] = []
    interests: List[str] = []
    bio: Optional[str] = None
    profile_image: Optional[str] = None
    is_verified: bool = False
    created_at: datetime = datetime.utcnow()

    class Settings:
        name = "users"

    class Config:
        schema_extra = {
            "example": {
                "name": "Faizan Faisal",
                "email": "faizan@example.com",
                "password": "hashed_password",
                "role": "finder",
                "skills": ["Python", "FastAPI", "MongoDB"],
                "bio": "Backend developer passionate about building AI-integrated systems."
            }
        }

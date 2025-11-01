# models/user_model.py
from beanie import Document
from pydantic import EmailStr, Field
from typing import List, Optional
from datetime import datetime

class User(Document):
    name: str
    email: EmailStr
    password: str
    role: str = "seeker"  # seeker or finder
    is_verified: bool = False
    skills: List[str] = []
    interests: List[str] = []
    bio: Optional[str] = None
    profile_image: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "users"

    class Config:
        json_schema_extra = {
            "example": {
                "name": "Faizan Faisal",
                "email": "faizan@example.com",
                "password": "hashed_password",
                "role": "finder",
                "skills": ["Python", "FastAPI"],
                "bio": "Backend developer passionate about AI."
            }
        }

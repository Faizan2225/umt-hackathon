from beanie import Document
from pydantic import EmailStr, Field
from typing import Optional, List

class User(Document):
    # name: str
    # email: EmailStr
    # hashed_password: str
    # skills: List[str] = []
    # interests: List[str] = []
    # role: str = "seeker"  # or 'finder'
    # verified: bool = False

    name: str
    email: EmailStr
    hashed_password: str
    skills: List[str] = []
    interests: List[str] = []
    role: str = "seeker"
    verified: bool = False         # newly added
    reset_password_token: Optional[str] = None  # optional field
    # ...

    class Settings:
        name = "users"


    

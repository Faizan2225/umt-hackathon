import requests
from fastapi import APIRouter, HTTPException, Depends
from models.user_model import User
from core.security import create_access_token
from pydantic import BaseModel
import os

router = APIRouter(prefix="/auth", tags=["Authentication"])

GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")
GOOGLE_REDIRECT_URI = os.getenv("GOOGLE_REDIRECT_URI")

class GoogleLoginResponse(BaseModel):
    url: str

@router.get("/google/login", response_model=GoogleLoginResponse)
async def google_login():
    params = {
        "response_type": "code",
        "client_id": GOOGLE_CLIENT_ID,
        "redirect_uri": GOOGLE_REDIRECT_URI,
        "scope": "openid email profile",
        "access_type": "offline",
        "prompt": "consent"
    }
    query = "&".join(f"{k}={v}" for k, v in params.items())
    url = f"https://accounts.google.com/o/oauth2/v2/auth?{query}"
    return {"url": url}

@router.get("/google/callback")
async def google_callback(code: str):
    if not code:
        raise HTTPException(status_code=400, detail="Code not provided")
    # Exchange code for token
    token_res = requests.post(
        "https://oauth2.googleapis.com/token",
        data={
            "code": code,
            "client_id": GOOGLE_CLIENT_ID,
            "client_secret": GOOGLE_CLIENT_SECRET,
            "redirect_uri": GOOGLE_REDIRECT_URI,
            "grant_type": "authorization_code"
        },
        headers={"Content-Type": "application/x-www-form-urlencoded"}
    )
    token_res_json = token_res.json()
    access_token = token_res_json.get("access_token")
    if not access_token:
        raise HTTPException(status_code=400, detail="Failed to get access token")

    # Get user info
    user_info_res = requests.get(
        "https://www.googleapis.com/oauth2/v2/userinfo",
        headers={"Authorization": f"Bearer {access_token}"}
    )
    user_info = user_info_res.json()
    email = user_info.get("email")
    name = user_info.get("name")

    if not email:
        raise HTTPException(status_code=400, detail="Google login failed")

    # Find or create user
    user = await User.find_one(User.email == email)
    if not user:
        # create new user
        user = User(
            name = name,
            email = email,
            hashed_password = "",  # or generate random password
            skills = [],
            interests = [],
            role = "seeker",
            verified = True
        )
        await user.insert()
    # generate JWT token
    token = create_access_token({"sub": str(user.id)})
    return {"access_token": token, "token_type": "bearer"}

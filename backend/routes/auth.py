# routes/auth.py
from fastapi import APIRouter, HTTPException, Depends, status
from models.user_model import User
from utils.auth_utils import hash_password, verify_password, create_access_token
from pydantic import BaseModel, EmailStr
from beanie import PydanticObjectId

router = APIRouter(prefix="/auth", tags=["Authentication"])

class SignupRequest(BaseModel):
    name: str
    email: EmailStr
    password: str

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class RoleSwitchRequest(BaseModel):
    role: str

@router.post("/signup")
async def signup(request: SignupRequest):
    existing_user = await User.find_one(User.email == request.email)
    if existing_user:
        raise HTTPException(status_code=400, detail="User already exists")

    hashed = hash_password(request.password)
    new_user = User(name=request.name, email=request.email, password=hashed)
    await new_user.insert()
    return {"message": "User registered successfully"}

@router.post("/login")
async def login(request: LoginRequest):
    user = await User.find_one(User.email == request.email)
    if not user or not verify_password(request.password, user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({"sub": str(user.id), "email": user.email})
    return {"access_token": token, "token_type": "bearer"}

@router.put("/switch-role/{user_id}")
async def switch_role(user_id: PydanticObjectId, data: RoleSwitchRequest):
    user = await User.get(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if data.role not in ["finder", "seeker"]:
        raise HTTPException(status_code=400, detail="Invalid role")

    user.role = data.role
    await user.save()
    return {"message": f"Role switched to {data.role}"}

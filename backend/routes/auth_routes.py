from fastapi import APIRouter, HTTPException, Depends
from models.user_model import User
from core.security import hash_password, verify_password, create_access_token, generate_token, verify_token
from core.dependencies import get_current_user
from pydantic import BaseModel, EmailStr
from core.email import send_verification_email, send_reset_password_email


router = APIRouter(prefix="/auth", tags=["Authentication"])

class RegisterSchema(BaseModel):
    name: str
    email: EmailStr
    password: str

class LoginSchema(BaseModel):
    email: EmailStr
    password: str

class ForgotPasswordSchema(BaseModel):
    email: EmailStr

class ResetPasswordSchema(BaseModel):
    token: str
    new_password: str

@router.post("/register")
async def register_user(user: RegisterSchema):
    existing = await User.find_one(User.email == user.email)
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered.")
    hashed = hash_password(user.password)
    new_user = User(name=user.name, email=user.email, hashed_password=hashed)
    await new_user.insert()
    return {"msg": "User registered successfully."}

@router.post("/login")
async def login_user(data: LoginSchema):
    user = await User.find_one(User.email == data.email)
    if not user or not verify_password(data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials.")
    token = create_access_token({"sub": str(user.id)})
    return {"access_token": token, "token_type": "bearer"}

@router.get("/me")
async def get_profile(current_user: User = Depends(get_current_user)):
    return current_user

@router.patch("/switch-role")
async def switch_role(current_user: User = Depends(get_current_user)):
    current_user.role = "finder" if current_user.role == "seeker" else "seeker"
    await current_user.save()
    return {"msg": f"Role switched to {current_user.role}"}



@router.post("/request-verification")
async def request_verification(email_schema: ForgotPasswordSchema):
    user = await User.find_one(User.email == email_schema.email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if user.verified:
        return {"msg": "Already verified"}
    token = generate_token(user.email, purpose="email-verify")
    await send_verification_email(user.email, token)
    return {"msg": "Verification email sent"}

@router.get("/verify")
async def verify_email(token: str):
    email = verify_token(token, purpose="email-verify", max_age=3600*24)
    if not email:
        raise HTTPException(status_code=400, detail="Invalid or expired token")
    user = await User.find_one(User.email == email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.verified = True
    await user.save()
    return {"msg": "Email verified successfully"}

@router.post("/forgot-password")
async def forgot_password(request: ForgotPasswordSchema):
    user = await User.find_one(User.email == request.email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    token = generate_token(user.email, purpose="password-reset")
    user.reset_password_token = token
    await user.save()
    await send_reset_password_email(user.email, token)
    return {"msg": "Password reset email sent"}

@router.post("/reset-password")
async def reset_password(data: ResetPasswordSchema):
    email = verify_token(data.token, purpose="password-reset", max_age=3600*1)
    if not email:
        raise HTTPException(status_code=400, detail="Invalid or expired token")
    user = await User.find_one(User.email == email)
    if not user or user.reset_password_token != data.token:
        raise HTTPException(status_code=400, detail="Invalid token or user")
    user.hashed_password = hash_password(data.new_password)
    user.reset_password_token = None
    await user.save()
    return {"msg": "Password reset successful"}

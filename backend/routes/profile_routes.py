
from fastapi import APIRouter, Depends, HTTPException
from models.user_model import User
from core.dependencies import get_current_user
from pydantic import BaseModel
from typing import Optional, List

router = APIRouter(prefix="/profile", tags=["Profile"])

class ProfileUpdate(BaseModel):
    name: Optional[str] = None
    skills: Optional[List[str]] = None
    interests: Optional[List[str]] = None

@router.put("/edit")
async def edit_profile(data: ProfileUpdate, current_user: User = Depends(get_current_user)):
    user = await User.get(current_user.id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    update_data = {k: v for k, v in data.dict().items() if v is not None}
    for key, value in update_data.items():
        setattr(user, key, value)
    await user.save()
    return {"msg": "Profile updated successfully", "updated_fields": update_data}

@router.get("/me")
async def get_my_profile(current_user: User = Depends(get_current_user)):
    return current_user

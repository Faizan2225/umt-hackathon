import os
from fastapi import APIRouter, File, UploadFile, HTTPException, Depends
from core.dependencies import get_current_user
from utils.skill_extraction import extract_skills_from_resume
UPLOAD_DIR = "app/uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

router = APIRouter(prefix="/upload", tags=["File Upload"])

@router.post("/resume")
async def upload_resume(file: UploadFile = File(...), current_user=Depends(get_current_user)):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported")

    filename = f"{current_user.id}_resume.pdf"
    file_path = os.path.join(UPLOAD_DIR, filename)

    with open(file_path, "wb") as f:
        f.write(await file.read())

    return {"msg": "Resume uploaded successfully", "path": file_path}



@router.post("/resume/skills")
async def upload_and_extract_skills(file: UploadFile = File(...), current_user=Depends(get_current_user)):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported")

    filename = f"{current_user.id}_resume.pdf"
    file_path = os.path.join(UPLOAD_DIR, filename)
    with open(file_path, "wb") as f:
        f.write(await file.read())

    skills = extract_skills_from_resume(file_path)
    if skills:
        # auto-update user profile
        user = current_user
        user.skills = list(set(user.skills + skills))
        await user.save()

    return {"msg": "Skills extracted successfully", "skills_found": skills}

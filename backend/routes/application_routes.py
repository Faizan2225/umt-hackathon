from fastapi import APIRouter, HTTPException, Depends, Query
from typing import Optional, List
from models.application_model import Application
from models.job_model import Job
from core.dependencies import get_current_user

router = APIRouter(prefix="/applications", tags=["Applications"])


# ----------------------------
# 🟢 Apply to a Job
# ----------------------------
@router.post("/")
async def apply_to_job(job_id: str, proposal: Optional[str] = None, resume_url: Optional[str] = None, current_user=Depends(get_current_user)):
    # Check if the job exists
    job = await Job.get(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    # Prevent applying twice
    existing = await Application.find_one(Application.job_id == job_id, Application.user_id == str(current_user.id))
    if existing:
        raise HTTPException(status_code=400, detail="Already applied to this job.")

    # Create application entry
    new_app = Application(
        job_id=job_id,
        user_id=str(current_user.id),
        proposal=proposal,
        resume_url=resume_url,
        status="Pending"
    )
    await new_app.insert()

    # Add applicant to job’s applicant list
    job.applicants.append(str(current_user.id))
    await job.save()

    return {"msg": "Application submitted successfully.", "application_id": str(new_app.id)}


# ----------------------------
# 🔵 View My Applications (Talent Seeker)
# ----------------------------
@router.get("/my")
async def get_my_applications(current_user=Depends(get_current_user)):
    apps = await Application.find(Application.user_id == str(current_user.id)).to_list()
    return {"total": len(apps), "applications": apps}


# ----------------------------
# 🟣 View Applicants for My Job (Talent Finder)
# ----------------------------
@router.get("/job/{job_id}")
async def get_job_applicants(job_id: str, current_user=Depends(get_current_user)):
    job = await Job.get(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    # Check permission
    if job.created_by != str(current_user.id):
        raise HTTPException(status_code=403, detail="Not authorized to view applicants for this job.")

    applicants = await Application.find(Application.job_id == job_id).to_list()
    return {"job_title": job.title, "total_applicants": len(applicants), "applicants": applicants}


# ----------------------------
# 🟠 Update Application Status (shortlist/reject/accept)
# ----------------------------
@router.patch("/{application_id}")
async def update_application_status(application_id: str, status: str = Query(..., regex="^(Shortlisted|Rejected|Accepted)$"), current_user=Depends(get_current_user)):
    app = await Application.get(application_id)
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")

    job = await Job.get(app.job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Associated job not found")

    # Only job creator can modify applicant status
    if job.created_by != str(current_user.id):
        raise HTTPException(status_code=403, detail="You can only manage applications for your own job postings.")

    app.status = status
    await app.save()

    return {"msg": f"Applicant status updated to {status}."}


# ----------------------------
# 🔍 Filter Applicants by Status (Finder view)
# ----------------------------
@router.get("/job/{job_id}/filter")
async def filter_applicants(job_id: str, status: Optional[str] = None, current_user=Depends(get_current_user)):
    job = await Job.get(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    if job.created_by != str(current_user.id):
        raise HTTPException(status_code=403, detail="You can only view your own applicants.")

    query = {"job_id": job_id}
    if status:
        query["status"] = status

    filtered_apps = await Application.find(query).to_list()
    return {"job_title": job.title, "status_filter": status or "All", "results": filtered_apps}

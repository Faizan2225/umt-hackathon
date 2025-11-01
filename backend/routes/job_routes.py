from fastapi import APIRouter, Depends, HTTPException, Query
from app.models.job_model import Job
from app.core.dependencies import get_current_user
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter(prefix="/jobs", tags=["Jobs"])


# ----------------------------
# 🧱 Schemas
# ----------------------------
class JobCreate(BaseModel):
    title: str
    description: str
    tags: List[str]


class JobUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    tags: Optional[List[str]] = None
    status: Optional[str] = None  # e.g. "open", "filled", "draft"


# ----------------------------
# 🟢 Create Job (Finder only)
# ----------------------------
@router.post("/")
async def create_job(job: JobCreate, current_user=Depends(get_current_user)):
    if current_user.role != "finder":
        raise HTTPException(status_code=403, detail="Only finders can post jobs.")
    new_job = Job(**job.dict(), created_by=str(current_user.id))
    await new_job.insert()
    return {"msg": "Job created successfully", "id": str(new_job.id)}


# ----------------------------
# 🔵 Get All Jobs (public)
# ----------------------------
@router.get("/")
async def list_jobs():
    jobs = await Job.find_all().to_list()
    return jobs


# ----------------------------
# 🟣 Get Job by ID
# ----------------------------
@router.get("/{job_id}")
async def get_job(job_id: str):
    job = await Job.get(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    job.views += 1
    await job.save()
    return job


# ----------------------------
# 🟠 Update Job (PUT /jobs/{id})
# ----------------------------
@router.put("/{job_id}")
async def update_job(job_id: str, data: JobUpdate, current_user=Depends(get_current_user)):
    job = await Job.get(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    # Only creator can edit
    if job.created_by != str(current_user.id):
        raise HTTPException(status_code=403, detail="Not authorized to edit this job")

    # Update fields dynamically
    update_data = {k: v for k, v in data.dict().items() if v is not None}
    for key, value in update_data.items():
        setattr(job, key, value)
    await job.save()

    return {"msg": "Job updated successfully", "updated_fields": update_data}


# ----------------------------
# 🔴 Delete Job
# ----------------------------
@router.delete("/{job_id}")
async def delete_job(job_id: str, current_user=Depends(get_current_user)):
    job = await Job.get(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    if job.created_by != str(current_user.id):
        raise HTTPException(status_code=403, detail="Not authorized to delete this job")

    await job.delete()
    return {"msg": "Job deleted successfully"}


# ----------------------------
# 🔍 Search / Filter Jobs
# ----------------------------
@router.get("/filter/")
async def filter_jobs(
    title: Optional[str] = Query(None, description="Filter by job title"),
    tag: Optional[str] = Query(None, description="Filter by a specific tag"),
    status: Optional[str] = Query(None, description="Filter by job status"),
    limit: int = Query(20, description="Number of results to return")
):
    query = {}

    if title:
        query["title"] = {"$regex": title, "$options": "i"}  # case-insensitive search
    if tag:
        query["tags"] = {"$regex": tag, "$options": "i"}
    if status:
        query["status"] = status

    # If query is empty, return all jobs
    if not query:
        jobs = await Job.find_all().limit(limit).to_list()
    else:
        jobs = await Job.find(query).limit(limit).to_list()

    return {"results": jobs, "filters_used": query}

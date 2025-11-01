# main.py
from fastapi import FastAPI
from database.connection import init_db
from routes import auth

app = FastAPI(title="CampusConnect Backend")

@app.on_event("startup")
async def start_database():
    await init_db()

app.include_router(auth.router)

@app.get("/")
async def root():
    return {"message": "CampusConnect Backend is running 🚀"}

# main.py
from fastapi import FastAPI
from database.connection import init_db

app = FastAPI(title="CampusConnect Backend")

@app.on_event("startup")
async def start_database():
    await init_db()

@app.get("/")
async def home():
    return {"message": "CampusConnect Backend is Running 🚀"}

# database/connection.py
from beanie import init_beanie
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

# Import all models here
from models.user_model import User
# from models.job_model import JobPost
# from models.application_model import Application
# from models.chat_model import ChatMessage

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
DB_NAME = os.getenv("DB_NAME")

async def init_db():
    client = AsyncIOMotorClient(MONGO_URI)
    database = client[DB_NAME]
    
    # Initialize Beanie with all models
    await init_beanie(
        database=database,
        document_models=[User]
        # document_models=[User, JobPost, Application, ChatMessage]
    )
    print("✅ MongoDB connected successfully!")

from datetime import datetime
from beanie import Document
from pydantic import Field
from typing import Optional

class ChatMessage(Document):
    room_id: str                     # Usually application_id or a shared job_id
    sender_id: str                   # User’s ID
    sender_name: Optional[str] = None
    message: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "chat_messages"       # MongoDB collection name

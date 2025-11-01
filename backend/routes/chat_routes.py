from fastapi import APIRouter, Depends, HTTPException
from models.chat_model import ChatMessage
from core.dependencies import get_current_user

router = APIRouter(prefix="/chat", tags=["Chat History"])

@router.get("/{room_id}")
async def get_chat_history(room_id: str, current_user=Depends(get_current_user)):
    """Fetch chat history for a specific room"""
    messages = await ChatMessage.find(ChatMessage.room_id == room_id).sort("+timestamp").to_list()
    # Return an empty message list if no history exists yet.
    # The frontend expects a 200 response and can render an empty conversation.
    return {"room_id": room_id, "total_messages": len(messages), "messages": messages}

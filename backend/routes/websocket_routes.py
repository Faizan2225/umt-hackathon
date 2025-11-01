from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends
from typing import List, Dict
from models.chat_model import ChatMessage
from core.dependencies import get_current_user
from datetime import datetime
import json

router = APIRouter(prefix="/ws", tags=["Chat System"])

# ----------------------------------------------------
# Connection Manager to handle active WebSocket clients
# ----------------------------------------------------
class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, List[WebSocket]] = {}  # room_id: [sockets]

    async def connect(self, websocket: WebSocket, room_id: str):
        await websocket.accept()
        if room_id not in self.active_connections:
            self.active_connections[room_id] = []
        self.active_connections[room_id].append(websocket)

    def disconnect(self, websocket: WebSocket, room_id: str):
        if room_id in self.active_connections:
            self.active_connections[room_id].remove(websocket)
            if not self.active_connections[room_id]:
                del self.active_connections[room_id]

    async def broadcast(self, room_id: str, message: dict):
        """Send message to all users in the same room"""
        if room_id in self.active_connections:
            for connection in self.active_connections[room_id]:
                await connection.send_text(json.dumps(message))


manager = ConnectionManager()


# ----------------------------------------------------
# WebSocket endpoint for live chat
# ----------------------------------------------------
@router.websocket("/chat/{room_id}")
async def websocket_endpoint(websocket: WebSocket, room_id: str):
    """
    Establishes a real-time WebSocket chat between Finder & Seeker.
    room_id = job_id or application_id (unique conversation)
    """
    await manager.connect(websocket, room_id)
    try:
        while True:
            data = await websocket.receive_text()
            payload = json.loads(data)
            message_text = payload.get("message")
            sender_id = payload.get("sender_id")
            sender_name = payload.get("sender_name")

            # Save message to MongoDB
            chat = ChatMessage(
                room_id=room_id,
                sender_id=sender_id,
                sender_name=sender_name,
                message=message_text,
                timestamp=datetime.utcnow(),
            )
            await chat.insert()

            # Broadcast to other participants in the same room
            await manager.broadcast(
                room_id,
                {
                    "sender_id": sender_id,
                    "sender_name": sender_name,
                    "message": message_text,
                    "timestamp": chat.timestamp.isoformat(),
                },
            )
    except WebSocketDisconnect:
        manager.disconnect(websocket, room_id)
        print(f"🔴 Disconnected from room: {room_id}")

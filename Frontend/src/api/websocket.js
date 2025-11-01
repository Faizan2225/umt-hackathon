/**
 * WebSocket client for real-time chat
 * Matches backend routes in backend/routes/websocket_routes.py
 */

export class WebSocketClient {
  constructor(url, roomId, onMessage, onError) {
    this.url = url;
    this.roomId = roomId;
    this.onMessage = onMessage;
    this.onError = onError;
    this.ws = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
  }

  connect(senderId, senderName) {
    const wsUrl = `${this.url}/ws/chat/${this.roomId}`;
    this.ws = new WebSocket(wsUrl);

    this.ws.onopen = () => {
      console.log('WebSocket connected');
      this.reconnectAttempts = 0;
    };

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (this.onMessage) {
          this.onMessage(data);
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      if (this.onError) {
        this.onError(error);
      }
    };

    this.ws.onclose = () => {
      console.log('WebSocket disconnected');
      // Attempt to reconnect
      if (this.reconnectAttempts < this.maxReconnectAttempts) {
        this.reconnectAttempts++;
        setTimeout(() => {
          this.connect(senderId, senderName);
        }, 1000 * this.reconnectAttempts);
      }
    };

    this.senderId = senderId;
    this.senderName = senderName;
  }

  sendMessage(message) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      const payload = {
        message,
        sender_id: this.senderId,
        sender_name: this.senderName,
      };
      this.ws.send(JSON.stringify(payload));
    } else {
      console.error('WebSocket is not connected');
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

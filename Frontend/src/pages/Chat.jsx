import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { chatService } from '../services/chatService';
import Loader from '../components/Loader';

/**
 * Real-time Chat/Messaging Page
 * Features:
 * - WebSocket-based real-time messaging
 * - Conversation list
 * - Message history
 * - Typing indicators
 */
const Chat = () => {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [currentConversation, setCurrentConversation] = useState(null);
  const [messageInput, setMessageInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    if (!user.id) {
      navigate('/login');
      return;
    }

    // Initialize socket connection
    const token = localStorage.getItem('token');
    socketRef.current = chatService.connect(user.id, token);

    // Load conversations
    loadConversations();

    // Listen for new messages
    chatService.onMessage((data) => {
      if (data.conversationId === conversationId || !conversationId) {
        setMessages((prev) => [...prev, data]);
        scrollToBottom();
      }
    });

    // Listen for typing indicators
    chatService.onTyping((data) => {
      if (data.conversationId === conversationId) {
        setIsTyping(data.isTyping);
      }
    });

    return () => {
      chatService.disconnect();
    };
  }, [user.id, conversationId, navigate]);

  useEffect(() => {
    if (conversationId) {
      loadMessages(conversationId);
    }
  }, [conversationId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadConversations = async () => {
    try {
      const data = await chatService.getConversations();
      setConversations(data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to load conversations:', error);
      setLoading(false);
    }
  };

  const loadMessages = async (convId) => {
    try {
      const data = await chatService.getMessages(convId);
      setMessages(data);
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = () => {
    if (!messageInput.trim() || !currentConversation) return;

    const receiverId = currentConversation.participants.find((p) => p.id !== user.id)?.id;
    if (receiverId) {
      chatService.sendMessage(receiverId, messageInput, currentConversation.jobId);
      setMessageInput('');
    }
  };

  const handleTyping = (isTypingValue) => {
    if (currentConversation) {
      const receiverId = currentConversation.participants.find((p) => p.id !== user.id)?.id;
      if (receiverId) {
        chatService.sendTyping(receiverId, isTypingValue);
      }
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen pt-20 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-10rem)]">
          {/* Conversations List */}
          <div className="lg:col-span-1 backdrop-blur-2xl bg-gradient-to-br from-white/80 via-white/70 to-white/80 border border-white/40 rounded-2xl shadow-xl shadow-indigo-500/10 overflow-hidden">
            <div className="p-4 border-b border-white/40">
              <h2 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Conversations
              </h2>
            </div>
            <div className="overflow-y-auto h-[calc(100%-4rem)]">
              {conversations.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  No conversations yet. Start a conversation from a job application.
                </div>
              ) : (
                conversations.map((conv) => (
                  <div
                    key={conv.id}
                    onClick={() => {
                      setCurrentConversation(conv);
                      navigate(`/chat/${conv.id}`);
                    }}
                    className={`p-4 cursor-pointer hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-all ${
                      conversationId === conv.id ? 'bg-gradient-to-r from-indigo-50 to-purple-50 border-l-4 border-indigo-500' : ''
                    }`}
                  >
                    <div className="font-semibold text-gray-900">
                      {conv.participants.find((p) => p.id !== user.id)?.name || 'User'}
                    </div>
                    <div className="text-sm text-gray-600 truncate">
                      {conv.lastMessage || 'No messages yet'}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Chat Window */}
          <div className="lg:col-span-2 backdrop-blur-2xl bg-gradient-to-br from-white/80 via-white/70 to-white/80 border border-white/40 rounded-2xl shadow-xl shadow-indigo-500/10 flex flex-col overflow-hidden">
            {currentConversation ? (
              <>
                <div className="p-4 border-b border-white/40">
                  <h3 className="text-lg font-bold text-gray-900">
                    {currentConversation.participants.find((p) => p.id !== user.id)?.name || 'User'}
                  </h3>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex ${msg.senderId === user.id ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                          msg.senderId === user.id
                            ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <p className="text-sm">{msg.message}</p>
                        <p className="text-xs mt-1 opacity-70">
                          {new Date(msg.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 px-4 py-2 rounded-2xl">
                        <span className="flex gap-1">
                          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></span>
                          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></span>
                        </span>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                <div className="p-4 border-t border-white/40">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={messageInput}
                      onChange={(e) => {
                        setMessageInput(e.target.value);
                        handleTyping(true);
                      }}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          sendMessage();
                          handleTyping(false);
                        }
                      }}
                      onBlur={() => handleTyping(false)}
                      className="flex-1 glass-input px-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500"
                      placeholder="Type a message..."
                    />
                    <button
                      onClick={sendMessage}
                      className="px-6 py-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                    >
                      Send
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <p className="text-lg font-semibold">Select a conversation to start chatting</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;


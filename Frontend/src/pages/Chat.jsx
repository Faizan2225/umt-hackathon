import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { chatService } from '../services/chatService';
import Loader from '../components/Loader';
import { motion } from 'framer-motion';

/**
 * Real-time Chat/Messaging Page
 * Modern glass-style interface with soft gradients and animations.
 */
const Chat = () => {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
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

    loadConversations();

    // If we have a conversationId, connect WebSocket and load messages
    if (conversationId) {
      const roomId = conversationId;
      const onMessage = (data) => {
        setMessages((prev) => [...prev, data]);
        scrollToBottom();
      };
      const onError = (error) => {
        console.error('WebSocket error:', error);
      };

      socketRef.current = chatService.connect(
        roomId,
        user.id,
        user.name || 'User',
        onMessage,
        onError
      );

      loadMessages(roomId);
    }

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
    if (!messageInput.trim() || !conversationId) return;

    chatService.sendMessage(messageInput);
    setMessageInput('');
    handleTyping(false);
  };

  const handleTyping = (isTypingValue) => {
    // Typing indicators not yet implemented in backend
    // chatService.sendTyping(receiverId, isTypingValue);
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen pt-20 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-10rem)]">
          
          {/* Conversation List */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="backdrop-blur-2xl bg-white/70 border border-white/50 rounded-2xl shadow-xl shadow-indigo-500/10 overflow-hidden"
          >
            <div className="p-5 border-b border-white/40 bg-gradient-to-r from-indigo-100/40 to-purple-100/40">
              <h2 className="text-xl font-extrabold text-indigo-700">Conversations</h2>
            </div>
            <div className="overflow-y-auto h-[calc(100%-4rem)] custom-scrollbar">
              {conversations.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  No conversations yet. Start chatting from a job application.
                </div>
              ) : (
                conversations.map((conv) => (
                  <div
                    key={conv.id}
                    onClick={() => {
                      navigate(`/chat/${conv.id}`);
                    }}
                    className={`p-4 border-b border-white/30 cursor-pointer transition-all ${
                      conversationId === conv.id
                        ? 'bg-gradient-to-r from-indigo-50 to-purple-50 border-l-4 border-indigo-500'
                        : 'hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50'
                    }`}
                  >
                    <div className="font-semibold text-gray-900">
                      {conv.jobTitle || conv.participants?.find((p) => p.id !== user.id && p.id !== user._id)?.name || 'Chat'}
                    </div>
                    <div className="text-sm text-gray-600 truncate">
                      {conv.lastMessage || 'No messages yet'}
                    </div>
                    {conv.application && (
                      <div className="text-xs text-gray-500 mt-1">
                        Status: {conv.application.status}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </motion.div>

          {/* Chat Window */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-2 backdrop-blur-2xl bg-white/70 border border-white/50 rounded-2xl shadow-xl shadow-indigo-500/10 flex flex-col overflow-hidden"
          >
            {conversationId ? (
              <>
                <div className="p-5 border-b border-white/40 flex items-center justify-between bg-gradient-to-r from-indigo-100/40 to-purple-100/40">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      {conversations.find(c => c.id === conversationId)?.jobTitle || 'Chat Room'}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {conversations.find(c => c.id === conversationId)?.participants?.find(p => p.id !== user.id && p.id !== user._id)?.name || 'Chatting about this job'}
                    </p>
                  </div>
                  <Link
                    to={`/jobs/${conversationId}`}
                    className="text-sm text-indigo-600 hover:underline px-3 py-1 rounded-lg hover:bg-indigo-50"
                  >
                    View Job →
                  </Link>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                  {messages.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">
                      <p>No messages yet. Start the conversation!</p>
                    </div>
                  ) : (
                    messages.map((msg, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                        className={`flex ${msg.sender_id === user.id || msg.sender_id === user._id ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs md:max-w-md px-5 py-3 rounded-2xl ${
                            msg.sender_id === user.id || msg.sender_id === user._id
                              ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white'
                              : 'bg-gray-100 text-gray-900'
                          } shadow-md`}
                        >
                          {msg.sender_id !== user.id && msg.sender_id !== user._id && (
                            <p className="text-xs mb-1 opacity-70">{msg.sender_name || 'User'}</p>
                          )}
                          <p className="text-sm">{msg.message}</p>
                          <p className={`text-xs mt-1 opacity-70 ${msg.sender_id === user.id || msg.sender_id === user._id ? 'text-right' : 'text-left'}`}>
                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </motion.div>
                    ))
                  )}

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

                {/* Input */}
                <div className="p-5 border-t border-white/40 bg-gradient-to-r from-indigo-50/40 to-purple-50/40">
                  <div className="flex gap-3">
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
                        }
                      }}
                      onBlur={() => handleTyping(false)}
                      className="flex-1 glass-input px-5 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500"
                      placeholder="Type a message..."
                    />
                    <button
                      onClick={sendMessage}
                      className="px-6 py-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-[1.02] transition-all"
                    >
                      Send
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <svg
                    className="w-16 h-16 mx-auto mb-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                  <p className="text-lg font-semibold">Select a conversation to start chatting</p>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Chat;

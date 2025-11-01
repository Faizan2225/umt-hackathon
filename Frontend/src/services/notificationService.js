import { useState, useEffect } from 'react';
import { jobService } from '../services/jobService';
import { authService } from '../services/authService';
import { chatService } from '../services/chatService';
import { notificationService } from '../services/notificationService';
import JobCard from '../components/JobCard';
import Loader from '../components/Loader';
import { calculateMatchScoresForJobs } from '../utils/matchscore';

const DashboardSeeker = () => {
  const [user, setUser] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chatConversations, setChatConversations] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  // Load user and jobs
  useEffect(() => {
    const u = localStorage.getItem('user');
    if (u) {
      const parsedUser = JSON.parse(u);
      setUser(parsedUser);

      // Connect chat socket
      chatService.connect(parsedUser._id, localStorage.getItem('token'));

      chatService.onMessage((msg) => {
        if (activeChat && msg.conversationId === activeChat._id) {
          setMessages((prev) => [...prev, msg]);
        }
        // Show notification for incoming message
        notificationService.showNotification('New Message', {
          body: msg.message,
        });
      });
    }

    fetchJobs(parsedUser);
    fetchConversations();
  }, []);

  // Fetch recommended jobs
  const fetchJobs = async (user) => {
    try {
      setLoading(true);
      let recommendedJobs = await jobService.getRecommendedJobs();
      // Calculate match scores based on user profile
      recommendedJobs = calculateMatchScoresForJobs(user, recommendedJobs);
      setJobs(recommendedJobs);
    } catch (err) {
      console.error('Error fetching jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch chat conversations
  const fetchConversations = async () => {
    try {
      const convs = await chatService.getConversations();
      setChatConversations(convs);
    } catch (err) {
      console.error('Error fetching conversations:', err);
    }
  };

  // Send chat message
  const handleSendMessage = () => {
    if (newMessage.trim() && activeChat) {
      chatService.sendMessage(activeChat.partnerId, newMessage, activeChat.jobId);
      setMessages((prev) => [
        ...prev,
        { senderId: user._id, message: newMessage, timestamp: new Date() },
      ]);
      setNewMessage('');
    }
  };

  // Apply to job
  const handleApply = async (jobId) => {
    try {
      await jobService.applyToJob(jobId, { userId: user._id });
      setJobs((prev) =>
        prev.map((job) => (job._id === jobId ? { ...job, applied: true } : job))
      );
      notificationService.showNotification('Application Submitted', {
        body: `You applied for job ID: ${jobId}`,
      });
    } catch (err) {
      console.error('Error applying to job:', err);
    }
  };

  // Bookmark job
  const handleBookmark = async (jobId) => {
    try {
      await jobService.bookmarkJob(jobId);
      setJobs((prev) =>
        prev.map((job) => (job._id === jobId ? { ...job, bookmarked: true } : job))
      );
      notificationService.showNotification('Job Bookmarked', {
        body: `Job ID: ${jobId} added to bookmarks`,
      });
    } catch (err) {
      console.error('Error bookmarking job:', err);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="flex gap-6 p-6">
      {/* Jobs List */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.map((job) => (
          <JobCard
            key={job._id}
            job={job}
            applied={job.applied}
            onApply={() => handleApply(job._id)}
          />
        ))}
      </div>

      {/* Chat Sidebar */}
      <div className="w-80 bg-white/80 backdrop-blur-lg rounded-xl p-4 shadow-md flex flex-col">
        <h3 className="text-lg font-bold mb-4">Chats</h3>
        <div className="flex-1 overflow-y-auto mb-4">
          {chatConversations.map((conv) => (
            <div
              key={conv._id}
              onClick={async () => {
                setActiveChat(conv);
                const msgs = await chatService.getMessages(conv._id);
                setMessages(msgs);
              }}
              className={`p-2 rounded-md cursor-pointer ${
                activeChat?._id === conv._id ? 'bg-indigo-100' : 'hover:bg-gray-100'
              }`}
            >
              <div className="font-semibold">{conv.partnerName}</div>
              <div className="text-xs text-gray-600 truncate">{conv.lastMessage}</div>
            </div>
          ))}
        </div>

        {/* Active Chat Window */}
        {activeChat && (
          <div className="flex flex-col border-t border-gray-300 pt-2">
            <div className="flex-1 overflow-y-auto h-64 mb-2">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`mb-2 p-2 rounded-md ${
                    msg.senderId === user._id
                      ? 'bg-indigo-200 self-end'
                      : 'bg-gray-200 self-start'
                  }`}
                >
                  {msg.message}
                  <div className="text-xs text-gray-500 mt-1">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                className="flex-1 p-2 rounded-md border border-gray-300"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <button
                onClick={handleSendMessage}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md"
              >
                Send
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardSeeker;

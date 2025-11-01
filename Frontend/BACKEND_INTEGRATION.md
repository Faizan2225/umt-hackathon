# 🔗 Backend Integration Complete!

This document describes how the frontend has been integrated with the FastAPI backend.

## ✅ **What Was Done**

### 1. **API Structure Created**
All backend APIs are now organized in the `src/api/` directory:
- `auth.js` - Authentication endpoints
- `jobs.js` - Job management endpoints
- `applications.js` - Application endpoints
- `chat.js` - Chat history endpoints
- `profile.js` - Profile management endpoints
- `upload.js` - File upload endpoints
- `websocket.js` - WebSocket client for real-time chat

### 2. **Services Updated**
All services in `src/services/` now use the new API files:
- `authService.js` - Uses `authAPI`
- `jobService.js` - Uses `jobsAPI` and `applicationsAPI`
- `chatService.js` - Uses `chatAPI` and `WebSocketClient`

### 3. **Pages Updated**
All pages have been updated to use the correct backend endpoints:
- `Login.jsx` - Uses `authService.login()`
- `Register.jsx` - Uses `authService.register()` and `authService.login()`
- `DashboardSeeker.jsx` - Uses `jobService.getRecommendedJobs()` and `applicationsAPI.getMyApplications()`
- `DashboardFinder.jsx` - Uses `jobService.getAllJobs()`, `createJob()`, `updateJob()`
- `JobList.jsx` - Uses `jobService.getAllJobs()`
- `JobDetails.jsx` - Uses `jobService.getJobById()`, `jobService.applyToJob()`, `uploadAPI.uploadResume()`
- `Chat.jsx` - Uses `chatService` with WebSocket client

### 4. **Configuration**
- ✅ Created `.env.example` with backend URL (port 8000)
- ✅ Updated `axios.js` to use correct base URL
- ✅ All API calls now use proper FastAPI endpoints

## 📋 **Environment Variables**

Create a `.env` file in the `Frontend` directory:

```env
# Backend API URL (FastAPI runs on port 8000 by default)
VITE_API_URL=http://localhost:8000

# WebSocket URL (same as API for FastAPI)
VITE_WS_URL=ws://localhost:8000
```

## 🔌 **API Endpoints Mapped**

### Authentication (`/auth`)
- ✅ `POST /auth/register` - Register new user
- ✅ `POST /auth/login` - Login user (returns `access_token`)
- ✅ `GET /auth/me` - Get current user profile
- ✅ `PATCH /auth/switch-role` - Switch between seeker/finder
- ✅ `POST /auth/request-verification` - Request email verification
- ✅ `GET /auth/verify?token=xxx` - Verify email
- ✅ `POST /auth/forgot-password` - Request password reset
- ✅ `POST /auth/reset-password` - Reset password
- ✅ `GET /auth/google/login` - Get Google OAuth URL
- ✅ `GET /auth/google/callback?code=xxx` - Handle Google OAuth callback

### Jobs (`/jobs`)
- ✅ `GET /jobs/` - Get all jobs
- ✅ `GET /jobs/{job_id}` - Get job by ID
- ✅ `POST /jobs/` - Create job (finder only)
- ✅ `PUT /jobs/{job_id}` - Update job (creator only)
- ✅ `DELETE /jobs/{job_id}` - Delete job (creator only)
- ✅ `GET /jobs/filter/?title=xxx&tag=xxx&status=xxx` - Filter jobs
- ✅ `GET /jobs/recommended` - Get recommended jobs for user

### Applications (`/applications`)
- ✅ `POST /applications/?job_id=xxx&proposal=xxx&resume_url=xxx` - Apply to job
- ✅ `GET /applications/my` - Get my applications (seeker)
- ✅ `GET /applications/job/{job_id}` - Get applicants for job (finder)
- ✅ `PATCH /applications/{application_id}?status=xxx` - Update application status
- ✅ `GET /applications/job/{job_id}/filter?status=xxx` - Filter applicants

### Chat (`/chat` & `/ws`)
- ✅ `GET /chat/{room_id}` - Get chat history
- ✅ `WS /ws/chat/{room_id}` - WebSocket for real-time chat

### Profile (`/profile`)
- ✅ `GET /profile/me` - Get my profile
- ✅ `PUT /profile/edit` - Update profile

### Upload (`/upload`)
- ✅ `POST /upload/resume` - Upload resume PDF
- ✅ `POST /upload/resume/skills` - Upload resume and extract skills

## 🔑 **Authentication Flow**

1. **Login/Register**: Backend returns `{ access_token, token_type: "bearer" }`
2. **Token Storage**: Token is stored in `localStorage` as `token`
3. **Auto-attach**: Axios interceptor automatically adds `Authorization: Bearer <token>` header
4. **User Profile**: After login, fetch user profile with `GET /auth/me`
5. **Logout**: Clear `localStorage` and redirect

## 📝 **Important Notes**

### Response Format
- Backend returns FastAPI-style responses (usually `response.data` in axios)
- Error responses use `{ detail: "error message" }` format
- Some endpoints return objects, others return arrays directly

### Job Data Structure
- Backend uses: `title`, `description`, `tags` (array)
- Frontend sometimes uses: `skills`, `company`, `location`, `salary` (not all in backend)
- Service layer handles mapping between formats

### Applications
- Backend uses query parameters: `?job_id=xxx&proposal=xxx&resume_url=xxx`
- Application statuses: `"Pending"`, `"Shortlisted"`, `"Rejected"`, `"Accepted"`

### WebSocket Chat
- Room ID format: Usually `job_id` or `application_id`
- Message format: `{ message, sender_id, sender_name, timestamp }`
- Connection: `ws://localhost:8000/ws/chat/{room_id}`

## 🚀 **Testing the Integration**

1. **Start Backend**:
   ```bash
   cd backend
   uvicorn main:app --reload
   ```

2. **Start Frontend**:
   ```bash
   cd Frontend
   npm install  # if not done
   npm run dev
   ```

3. **Test Authentication**:
   - Register a new user
   - Login with credentials
   - Check browser console and network tab for API calls

4. **Test Job Features**:
   - Create a job (as finder)
   - Browse jobs (as seeker)
   - Apply to a job
   - View applications (as finder)

5. **Test Chat**:
   - Navigate to chat with room ID (e.g., `/chat/{job_id}`)
   - Send messages via WebSocket

## ⚠️ **Known Limitations**

1. **Conversations List**: Chat conversations list is not fully implemented (backend doesn't have endpoint yet)
2. **Bookmarks**: Bookmark feature not implemented in backend
3. **Job Filtering**: Frontend filtering is client-side; backend has server-side filtering via `/jobs/filter/`
4. **User ID Format**: Backend uses MongoDB ObjectId which can be string or ObjectId - code handles both

## 🔧 **Troubleshooting**

### CORS Errors
- Ensure backend CORS is configured in `backend/main.py`
- Check that frontend URL is in allowed origins

### 401 Unauthorized
- Check token is stored in localStorage
- Verify token hasn't expired (24 hours by default)
- Check axios interceptor is adding token to headers

### WebSocket Connection Failed
- Verify backend is running
- Check WebSocket URL in `.env`
- Ensure room_id is valid

### API Calls Failing
- Check browser console for errors
- Verify backend is running on port 8000
- Check network tab for request/response details
- Verify `.env` file has correct `VITE_API_URL`

## 📚 **Next Steps**

1. ✅ All core APIs are integrated
2. 🔄 Test all features end-to-end
3. 🔄 Add error handling UI (toasts, notifications)
4. 🔄 Implement conversations list endpoint in backend
5. 🔄 Add pagination for job listings
6. 🔄 Add job bookmarking feature
7. 🔄 Improve WebSocket error handling

---

**Integration Status**: ✅ **Complete** - All backend APIs are linked and ready for testing!

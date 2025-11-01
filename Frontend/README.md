# CampusConnect - Frontend

A modern, responsive web application connecting Talent Finders (employers) with Talent Seekers (students/job seekers).

## 🚀 Tech Stack

- **React 19** - UI Library
- **Vite** - Build tool and dev server
- **React Router DOM v7** - Client-side routing
- **Tailwind CSS v4** - Utility-first CSS framework
- **Axios** - HTTP client for API calls
- **Socket.io-client** - Real-time communication (for future chat feature)

## 📁 Project Structure

```
src/
├── api/
│   └── axios.js              # Axios instance with interceptors
├── components/
│   ├── Navbar.jsx            # Navigation bar
│   ├── Footer.jsx            # Site footer
│   ├── JobCard.jsx           # Job listing card component
│   └── Loader.jsx            # Loading spinner
├── pages/
│   ├── Landing.jsx           # Homepage
│   ├── Login.jsx             # Login page
│   ├── Register.jsx          # Registration page
│   ├── DashboardSeeker.jsx   # Job seeker dashboard
│   ├── DashboardFinder.jsx   # Employer dashboard
│   ├── JobList.jsx           # Browse all jobs
│   └── JobDetails.jsx        # Individual job details
├── App.jsx                   # Main app with routes
├── main.jsx                  # Entry point with BrowserRouter
└── index.css                 # Global styles with Tailwind
```

## 🛠️ Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Create a `.env` file in the root of the `Frontend` directory:

```env
VITE_API_URL=http://localhost:5000/api
```

Update the URL if your backend runs on a different port.

### 3. Run Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173` (or the port Vite assigns).

### 4. Build for Production

```bash
npm run build
```

## ✨ Features

### Authentication
- User registration with role selection (Seeker/Finder)
- Login with JWT token storage
- Protected routes based on user role
- Automatic token attachment to API requests

### Job Seekers (Talent Seekers)
- Browse all available job postings
- Search and filter jobs by location, salary, keywords
- View detailed job information
- Apply for jobs
- Dashboard showing applied jobs and recommendations

### Employers (Talent Finders)
- Create and manage job postings
- View all posted jobs
- Dashboard with statistics
- Job creation form with validation

### UI/UX
- Responsive design (mobile, tablet, desktop)
- Modern Tailwind CSS styling
- Loading states and error handling
- Smooth navigation with React Router

## 🔌 API Integration

The frontend is configured to connect with a Node.js + Express backend. All API calls are handled through the axios instance in `src/api/axios.js`, which:

- Automatically attaches JWT tokens to requests
- Handles 401 errors (token expiration)
- Uses environment variable for base URL

### Mock Data

Until the backend is ready, the app uses mock data for development. All API calls have fallback mock data that will work immediately. Simply replace the API endpoints in the pages/components when your backend is ready.

## 📝 Development Notes

- All routes are protected by authentication checks
- User data is stored in `localStorage` (token + user object)
- Mock authentication is available for testing (check Login/Register pages)
- The app gracefully handles API failures and uses mock data as fallback

## 🚧 Backend Integration

When your backend is ready, update the following:

1. Ensure `.env` has the correct `VITE_API_URL`
2. Remove mock data fallbacks in:
   - `pages/Login.jsx`
   - `pages/Register.jsx`
   - `pages/DashboardSeeker.jsx`
   - `pages/DashboardFinder.jsx`
   - `pages/JobList.jsx`
   - `pages/JobDetails.jsx`

## 📄 License

This project is part of the CampusConnect application.
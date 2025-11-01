import axios from 'axios';

// Create axios instance with base URL from environment variable
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors (e.g., 401 unauthorized)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only log out on 401 if we have a token (means token is invalid/expired)
    // Don't log out if there's no token (user is already logged out)
    if (error.response?.status === 401) {
      const token = localStorage.getItem('token');
      if (token) {
        // Token exists but is invalid/expired
        console.warn('Token expired or invalid, logging out');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('activeRole');
        window.dispatchEvent(new Event('auth-change'));
        
        // Use React Router navigation if available, otherwise use window.location
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
      // If no token, just reject the error (don't redirect again)
    }
    return Promise.reject(error);
  }
);

export default api;

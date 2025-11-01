/**
 * Notification Service
 * Handles push notifications and in-app notifications
 */

export const notificationService = {
  // Request notification permission
  requestPermission: async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return false;
  },

  // Check if permission granted
  hasPermission: () => {
    if ('Notification' in window) {
      return Notification.permission === 'granted';
    }
    return false;
  },

  // Show notification
  showNotification: (title, options = {}) => {
    if (notificationService.hasPermission()) {
      const notification = new Notification(title, {
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        ...options,
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
      };

      return notification;
    }
  },

  // Setup service worker for push notifications (if available)
  setupServiceWorker: async () => {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('Service Worker registered:', registration);
        return registration;
      } catch (error) {
        console.error('Service Worker registration failed:', error);
        return null;
      }
    }
    return null;
  },

  // Subscribe to push notifications
  subscribeToPush: async (userId) => {
    try {
      const registration = await notificationService.setupServiceWorker();
      if (!registration) return null;

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: import.meta.env.VITE_VAPID_PUBLIC_KEY,
      });

      // Send subscription to backend
      await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/notifications/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          userId,
          subscription,
        }),
      });

      return subscription;
    } catch (error) {
      console.error('Push subscription failed:', error);
      return null;
    }
  },
};


import axios from 'axios';

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the auth token and fix the API path
api.interceptors.request.use(
  (config) => {
    // Check if we're in the browser
    if (typeof window !== 'undefined') {
      const authStorage = localStorage.getItem('auth-storage');
      if (authStorage) {
        try {
          const { state } = JSON.parse(authStorage);
          if (state.token) {
            config.headers['Authorization'] = `Bearer ${state.token}`;
          }
        } catch (error) {
          console.error('Error parsing auth storage', error);
        }
      }
    }
    
    // Add /api prefix to auth and notes endpoints if not already present
    if (config.url && !config.url.startsWith('/api') && 
        (config.url.startsWith('/auth') || config.url.startsWith('/notes'))) {
      config.url = `/api${config.url}`;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

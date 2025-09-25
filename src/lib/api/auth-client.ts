import axios, { AxiosError, AxiosResponse } from 'axios';

// Create axios instance for authentication
export const authClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_AUTH_API_URL || 'http://localhost:4433',
  withCredentials: true,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: attach auth tokens
authClient.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor: handle auth errors and token refresh
authClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized responses
    if (error.response?.status === 401) {
      // Clear auth state and redirect to login
      // This will be handled by the store
      if (typeof window !== 'undefined') {
        // Dispatch logout action
        window.dispatchEvent(new CustomEvent('auth:logout'));
      }
    }

    // Handle 403 Forbidden
    if (error.response?.status === 403) {
      // Handle insufficient permissions
      console.error('Access forbidden');
    }

    // Handle network errors
    if (!error.response) {
      console.error('Network error:', error.message);
    }

    return Promise.reject(error);
  },
);

export default authClient;

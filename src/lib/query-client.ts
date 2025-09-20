import { QueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 30 * 60 * 1000, // 30 minutes (formerly cacheTime)
      retry: (failureCount, error) => {
        const axiosError = error as AxiosError;

        // Don't retry on authentication errors
        if (
          axiosError.response?.status === 401 ||
          axiosError.response?.status === 403
        ) {
          return false;
        }

        // Don't retry on client errors (4xx)
        if (
          axiosError.response?.status &&
          axiosError.response.status >= 400 &&
          axiosError.response.status < 500
        ) {
          return false;
        }

        // Retry up to 3 times for other errors
        return failureCount < 3;
      },
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: (failureCount, error) => {
        const axiosError = error as AxiosError;

        // Don't retry mutations on client errors
        if (
          axiosError.response?.status &&
          axiosError.response.status >= 400 &&
          axiosError.response.status < 500
        ) {
          return false;
        }

        // Retry once for server errors
        return failureCount < 1;
      },
      onError: (error) => {
        const axiosError = error as AxiosError;

        // Handle auth errors globally
        if (axiosError.response?.status === 401) {
          // Emit logout event
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('auth:logout'));
          }
        }
      },
    },
  },
});

// Query key factory for consistent key management
export const queryKeys = {
  auth: ['auth'] as const,
  user: () => [...queryKeys.auth, 'user'] as const,
  session: () => [...queryKeys.auth, 'session'] as const,
  profile: (id?: string) => ['profile', ...(id ? [id] : [])] as const,
  contacts: (userId?: string) =>
    ['contacts', ...(userId ? [userId] : [])] as const,
  leads: (userId?: string) => ['leads', ...(userId ? [userId] : [])] as const,
};

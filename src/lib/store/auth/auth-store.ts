import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { AuthUser, Session } from '@/types/auth';

interface AuthState {
  // State
  user: AuthUser | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  requires2FA: boolean;
  error: string | null;

  // Pure State Actions Only
  setUser: (user: AuthUser | null) => void;
  setSession: (session: Session | null) => void;
  setAuthenticated: (authenticated: boolean) => void;
  setLoading: (loading: boolean) => void;
  setRequires2FA: (requires2FA: boolean) => void;
  setError: (error: string | null) => void;
  clearAuth: () => void;
  selectProfile: (profileId: string) => void; // Legacy compatibility
}

const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        user: null,
        session: null,
        isAuthenticated: false,
        isLoading: false,
        requires2FA: false,
        error: null,

        // Actions - Pure State Management Only
        setUser: (user: AuthUser | null) => {
          set({ user, isAuthenticated: !!user });
        },

        setSession: (session: Session | null) => {
          set({ session });
        },

        setAuthenticated: (authenticated: boolean) => {
          set({ isAuthenticated: authenticated });
        },

        setLoading: (loading: boolean) => {
          set({ isLoading: loading });
        },

        setRequires2FA: (requires2FA: boolean) => {
          set({ requires2FA });
        },

        setError: (error: string | null) => {
          set({ error });
        },

        clearAuth: () => {
          set({
            user: null,
            session: null,
            isAuthenticated: false,
            isLoading: false,
            requires2FA: false,
            error: null,
          });
        },

        selectProfile: (profileId: string) => {
          set((state) => ({
            user: state.user
              ? { ...state.user, selectedProfile: profileId }
              : null,
          }));
        },
      }),
      {
        name: 'auth-store',
        partialize: (state) => ({
          user: state.user,
          session: state.session,
          isAuthenticated: state.isAuthenticated,
        }),
      },
    ),
    { name: 'AuthStore' },
  ),
);

// Selector hooks
export const useUser = () => useAuthStore((state) => state.user);
export const useSession = () => useAuthStore((state) => state.session);
export const useIsAuthenticated = () =>
  useAuthStore((state) => state.isAuthenticated);
export const useAuthLoading = () => useAuthStore((state) => state.isLoading);
export const useRequires2FA = () => useAuthStore((state) => state.requires2FA);
export const useAuthError = () => useAuthStore((state) => state.error);

// Action hooks - Pure State Management Only
export const useSetUser = () => useAuthStore((state) => state.setUser);
export const useSetSession = () => useAuthStore((state) => state.setSession);
export const useSetAuthenticated = () =>
  useAuthStore((state) => state.setAuthenticated);
export const useSetAuthLoading = () =>
  useAuthStore((state) => state.setLoading);
export const useSetRequires2FA = () =>
  useAuthStore((state) => state.setRequires2FA);
export const useSetAuthError = () => useAuthStore((state) => state.setError);
export const useClearAuth = () => useAuthStore((state) => state.clearAuth);
export const useSelectProfile = () =>
  useAuthStore((state) => state.selectProfile);

// Listen for logout events from axios interceptors
if (typeof window !== 'undefined') {
  window.addEventListener('auth:logout', () => {
    useAuthStore.getState().clearAuth();
  });
}

export default useAuthStore;

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { Session } from '@/types/auth';

interface SessionState {
  currentSession: Session | null;
  isValidating: boolean;
  lastValidated: Date | null;
  error: string | null;

  // Actions
  setSession: (session: Session | null) => void;
  validateSession: () => Promise<boolean>;
  refreshSession: () => Promise<Session | null>;
  clearSession: () => void;
  setValidating: (validating: boolean) => void;
  setError: (error: string | null) => void;
}

const useSessionStore = create<SessionState>()(
  devtools(
    (set, get) => ({
      // Initial state
      currentSession: null,
      isValidating: false,
      lastValidated: null,
      error: null,

      // Actions
      setSession: (session: Session | null) => {
        set({
          currentSession: session,
          lastValidated: session ? new Date() : null,
          error: null,
        });
      },

      validateSession: async (): Promise<boolean> => {
        set({ isValidating: true, error: null });

        try {
          // TODO: Replace with actual API call
          console.log('Validating session');

          const { currentSession } = get();
          if (!currentSession) {
            set({ isValidating: false });
            return false;
          }

          // Mock session validation
          await new Promise((resolve) => setTimeout(resolve, 500));

          // Check if session is expired
          const isExpired = new Date() > new Date(currentSession.expiresAt);

          if (isExpired) {
            get().clearSession();
            set({ isValidating: false });
            return false;
          }

          set({
            isValidating: false,
            lastValidated: new Date(),
          });

          return true;
        } catch (error) {
          const errorMessage =
            error instanceof Error
              ? error.message
              : 'Session validation failed';
          set({
            error: errorMessage,
            isValidating: false,
          });
          return false;
        }
      },

      refreshSession: async (): Promise<Session | null> => {
        set({ isValidating: true, error: null });

        try {
          // TODO: Replace with actual API call
          console.log('Refreshing session');

          // Mock session refresh
          await new Promise((resolve) => setTimeout(resolve, 1000));

          const refreshedSession: Session = {
            id: 'refreshed-session-id',
            userId: 'user-id',
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
            isActive: true,
          };

          set({
            currentSession: refreshedSession,
            isValidating: false,
            lastValidated: new Date(),
          });

          return refreshedSession;
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : 'Session refresh failed';
          set({
            error: errorMessage,
            isValidating: false,
            currentSession: null,
          });
          return null;
        }
      },

      clearSession: () => {
        set({
          currentSession: null,
          isValidating: false,
          lastValidated: null,
          error: null,
        });
      },

      setValidating: (validating: boolean) => {
        set({ isValidating: validating });
      },

      setError: (error: string | null) => {
        set({ error });
      },
    }),
    { name: 'SessionStore' },
  ),
);

// Selector hooks
export const useCurrentSession = () =>
  useSessionStore((state) => state.currentSession);
export const useSessionValidating = () =>
  useSessionStore((state) => state.isValidating);
export const useLastValidated = () =>
  useSessionStore((state) => state.lastValidated);
export const useSessionError = () => useSessionStore((state) => state.error);

// Action hooks
export const useSetCurrentSession = () =>
  useSessionStore((state) => state.setSession);
export const useValidateSession = () =>
  useSessionStore((state) => state.validateSession);
export const useRefreshSession = () =>
  useSessionStore((state) => state.refreshSession);
export const useClearSession = () =>
  useSessionStore((state) => state.clearSession);
export const useSetSessionValidating = () =>
  useSessionStore((state) => state.setValidating);
export const useSetSessionError = () =>
  useSessionStore((state) => state.setError);

export default useSessionStore;

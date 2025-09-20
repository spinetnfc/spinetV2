import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { Session } from '@/types/auth';

interface SessionState {
  currentSession: Session | null;
  isValidating: boolean;
  lastValidated: Date | null;
  error: string | null;

  // Pure State Actions Only
  setSession: (session: Session | null) => void;
  setValidating: (validating: boolean) => void;
  setLastValidated: (date: Date | null) => void;
  setError: (error: string | null) => void;
  clearSession: () => void;
}

const useSessionStore = create<SessionState>()(
  devtools(
    (set, get) => ({
      // Initial state
      currentSession: null,
      isValidating: false,
      lastValidated: null,
      error: null,

      // Actions - Pure State Management Only
      setSession: (session: Session | null) => {
        set({
          currentSession: session,
          lastValidated: session ? new Date() : null,
          error: null,
        });
      },

      setValidating: (validating: boolean) => {
        set({ isValidating: validating });
      },

      setLastValidated: (date: Date | null) => {
        set({ lastValidated: date });
      },

      setError: (error: string | null) => {
        set({ error });
      },

      clearSession: () => {
        set({
          currentSession: null,
          isValidating: false,
          lastValidated: null,
          error: null,
        });
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

// Action hooks - Pure State Management Only
export const useSetCurrentSession = () =>
  useSessionStore((state) => state.setSession);
export const useSetSessionValidating = () =>
  useSessionStore((state) => state.setValidating);
export const useSetLastValidated = () =>
  useSessionStore((state) => state.setLastValidated);
export const useSetSessionError = () =>
  useSessionStore((state) => state.setError);
export const useClearSession = () =>
  useSessionStore((state) => state.clearSession);

export default useSessionStore;

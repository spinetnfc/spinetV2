import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type {
  AuthUser,
  Session,
  LoginCredentials,
  RegisterData,
  LoginResult,
} from '@/types/auth';

interface AuthState {
  // State
  user: AuthUser | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  requires2FA: boolean;
  error: string | null;

  // Actions
  login: (credentials: LoginCredentials) => Promise<LoginResult>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  verifyOTP: (code: string) => Promise<void>;
  setUser: (user: AuthUser | null) => void;
  setSession: (session: Session | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearAuth: () => void;
  checkAuthStatus: () => Promise<boolean>;
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

        // Actions
        login: async (credentials: LoginCredentials): Promise<LoginResult> => {
          set({ isLoading: true, error: null });

          try {
            // TODO: Replace with actual API call
            console.log('Login attempt:', credentials);

            // Mock successful login for development
            await new Promise((resolve) => setTimeout(resolve, 1000));

            const mockUser: AuthUser = {
              id: 'mock-user-id',
              _id: 'mock-user-id', // Legacy compatibility
              email: credentials.email,
              firstName: 'Demo',
              lastName: 'User',
              fullName: 'Demo User',
              isEmailVerified: true,
              roles: ['user'],
              selectedProfile: 'profile-dev-1', // Legacy compatibility
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };

            const mockSession: Session = {
              id: 'mock-session-id',
              userId: mockUser.id,
              expiresAt: new Date(
                Date.now() + 24 * 60 * 60 * 1000,
              ).toISOString(),
              isActive: true,
            };

            set({
              user: mockUser,
              session: mockSession,
              isAuthenticated: true,
              isLoading: false,
              requires2FA: false,
            });

            return {
              success: true,
              user: mockUser,
              session: mockSession,
            };
          } catch (error) {
            const errorMessage =
              error instanceof Error ? error.message : 'Login failed';
            set({
              error: errorMessage,
              isLoading: false,
              isAuthenticated: false,
            });

            return {
              success: false,
              error: errorMessage,
            };
          }
        },

        register: async (data: RegisterData): Promise<void> => {
          set({ isLoading: true, error: null });

          try {
            // TODO: Replace with actual API call
            console.log('Register attempt:', data);

            // Mock registration
            await new Promise((resolve) => setTimeout(resolve, 1000));

            set({ isLoading: false });
          } catch (error) {
            const errorMessage =
              error instanceof Error ? error.message : 'Registration failed';
            set({ error: errorMessage, isLoading: false });
            throw error;
          }
        },

        logout: async (): Promise<void> => {
          set({ isLoading: true });

          try {
            // TODO: Replace with actual API call
            console.log('Logout attempt');

            // Mock logout
            await new Promise((resolve) => setTimeout(resolve, 500));

            set({
              user: null,
              session: null,
              isAuthenticated: false,
              isLoading: false,
              requires2FA: false,
              error: null,
            });
          } catch (error) {
            console.error('Logout error:', error);
            // Force logout even if API call fails
            set({
              user: null,
              session: null,
              isAuthenticated: false,
              isLoading: false,
              requires2FA: false,
              error: null,
            });
          }
        },

        verifyOTP: async (code: string): Promise<void> => {
          set({ isLoading: true, error: null });

          try {
            // TODO: Replace with actual API call
            console.log('OTP verification:', code);

            // Mock OTP verification
            await new Promise((resolve) => setTimeout(resolve, 1000));

            set({
              requires2FA: false,
              isLoading: false,
            });
          } catch (error) {
            const errorMessage =
              error instanceof Error
                ? error.message
                : 'OTP verification failed';
            set({ error: errorMessage, isLoading: false });
            throw error;
          }
        },

        setUser: (user: AuthUser | null) => {
          set({ user, isAuthenticated: !!user });
        },

        setSession: (session: Session | null) => {
          set({ session });
        },

        setLoading: (loading: boolean) => {
          set({ isLoading: loading });
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

        checkAuthStatus: async (): Promise<boolean> => {
          try {
            // TODO: Replace with actual API call to validate session
            console.log('Checking auth status');

            const { session } = get();
            if (!session) return false;

            // Check if session is expired
            const isExpired = new Date() > new Date(session.expiresAt);
            if (isExpired) {
              get().clearAuth();
              return false;
            }

            return true;
          } catch (error) {
            console.error('Auth status check failed:', error);
            get().clearAuth();
            return false;
          }
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

// Action hooks
export const useLogin = () => useAuthStore((state) => state.login);
export const useRegister = () => useAuthStore((state) => state.register);
export const useLogout = () => useAuthStore((state) => state.logout);
export const useVerifyOTP = () => useAuthStore((state) => state.verifyOTP);
export const useSetUser = () => useAuthStore((state) => state.setUser);
export const useSetSession = () => useAuthStore((state) => state.setSession);
export const useSetAuthLoading = () =>
  useAuthStore((state) => state.setLoading);
export const useSetAuthError = () => useAuthStore((state) => state.setError);
export const useClearAuth = () => useAuthStore((state) => state.clearAuth);
export const useCheckAuthStatus = () =>
  useAuthStore((state) => state.checkAuthStatus);
export const useSelectProfile = () =>
  useAuthStore((state) => state.selectProfile);

// Listen for logout events from axios interceptors
if (typeof window !== 'undefined') {
  window.addEventListener('auth:logout', () => {
    useAuthStore.getState().clearAuth();
  });
}

export default useAuthStore;

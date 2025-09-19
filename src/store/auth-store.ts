import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { User } from '@/types/user';

// Mock user for frontend development
const mockUser: User = {
  _id: 'mock-user-123',
  email: 'demo@spinet.com',
  fullName: 'Demo User',
  firstName: 'Demo',
  lastName: 'User',
  birthDate: '1990-01-01',
  gender: 'other',
  companyName: 'Spinet Demo',
  activitySector: 'Technology',
  position: 'Frontend Developer',
  phoneNumber: '+1234567890',
  website: 'https://demo.spinet.com',
  language: 'en',
  theme: { color: 'blue' },
  Pro: { company: true, freeTrial: true },
  createdAt: new Date().toISOString(),
  selectedProfile: 'profile-dev-1', // Use existing mock profile ID
  tokens: {
    fileApiToken: 'mock-token',
    fileApiRefreshToken: 'mock-refresh-token',
  },
};

interface AuthState {
  // State
  user: User;
  isLoading: boolean;
  isAuthenticated: boolean;

  // Computed properties
  isCompany: boolean;
  isPro: boolean;

  // Actions
  login: (user: User) => void;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  setLoading: (loading: boolean) => void;
  selectProfile: (profileId: string) => void;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        user: mockUser,
        isLoading: false,
        isAuthenticated: true, // Always authenticated in dev mode

        // Computed properties (getters)
        get isCompany() {
          return get().user.Pro?.company || false;
        },

        get isPro() {
          const user = get().user;
          return user.Pro?.freeTrial || user.Pro?.expiresAt ? true : false;
        },

        // Actions
        login: (userData: User) => {
          set(
            (state) => ({
              user: userData,
              isAuthenticated: true,
              isLoading: false,
            }),
            false,
            'auth/login',
          );
        },

        logout: () => {
          // For development, just keep the mock user
          console.log('Logout called - staying with mock user for development');
          set(
            (state) => ({
              user: mockUser,
              isAuthenticated: true, // Keep authenticated in dev
            }),
            false,
            'auth/logout',
          );
        },

        updateUser: (userData: Partial<User>) => {
          set(
            (state) => ({
              user: { ...state.user, ...userData },
            }),
            false,
            'auth/updateUser',
          );
        },

        setLoading: (loading: boolean) => {
          set(
            (state) => ({
              isLoading: loading,
            }),
            false,
            'auth/setLoading',
          );
        },

        selectProfile: (profileId: string) => {
          set(
            (state) => ({
              user: { ...state.user, selectedProfile: profileId },
            }),
            false,
            'auth/selectProfile',
          );
        },
      }),
      {
        name: 'auth-storage',
        // Only persist essential user data, not loading states
        partialize: (state) => ({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
        }),
      },
    ),
    { name: 'AuthStore' },
  ),
);

// Selector hooks for better performance
export const useUser = () => useAuthStore((state) => state.user);
export const useIsAuthenticated = () =>
  useAuthStore((state) => state.isAuthenticated);
export const useIsCompany = () => useAuthStore((state) => state.isCompany);
export const useIsPro = () => useAuthStore((state) => state.isPro);
export const useAuthLoading = () => useAuthStore((state) => state.isLoading);

// Action hooks - individual hooks prevent infinite loops
export const useLogin = () => useAuthStore((state) => state.login);
export const useLogout = () => useAuthStore((state) => state.logout);
export const useUpdateUser = () => useAuthStore((state) => state.updateUser);
export const useSetLoading = () => useAuthStore((state) => state.setLoading);
export const useSelectProfile = () =>
  useAuthStore((state) => state.selectProfile);

// Deprecated: Use individual action hooks above to prevent infinite loops
export const useAuthActions = () => ({
  login: useAuthStore.getState().login,
  logout: useAuthStore.getState().logout,
  updateUser: useAuthStore.getState().updateUser,
  setLoading: useAuthStore.getState().setLoading,
  selectProfile: useAuthStore.getState().selectProfile,
});

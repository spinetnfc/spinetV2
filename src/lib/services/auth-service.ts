import { authRepository } from '@/lib/repositories/auth/auth-repository';
import useAuthStore from '@/lib/store/auth/auth-store';
import type {
  LoginCredentials,
  RegisterData,
  LoginResult,
  AuthUser,
  Session,
} from '@/types/auth';

/**
 * Auth Service - Handles business logic and coordinates between repository and store
 */
export class AuthService {
  // Login business logic
  async login(credentials: LoginCredentials): Promise<LoginResult> {
    const {
      setLoading,
      setError,
      setUser,
      setSession,
      setAuthenticated,
      setRequires2FA,
    } = useAuthStore.getState();

    setLoading(true);
    setError(null);

    try {
      // Call repository for API interaction
      const authResponse = await authRepository.login(credentials);

      // Transform response to store format
      const user: AuthUser = {
        id: authResponse.user.id,
        _id: authResponse.user.id, // Legacy compatibility
        email: authResponse.user.email,
        firstName: authResponse.user.firstName,
        lastName: authResponse.user.lastName,
        fullName: authResponse.user.fullName,
        isEmailVerified: authResponse.user.isEmailVerified,
        roles: authResponse.user.roles,
        selectedProfile: authResponse.user.selectedProfile || 'profile-dev-1', // Legacy compatibility
        createdAt: authResponse.user.createdAt,
        updatedAt: authResponse.user.updatedAt,
      };

      const session: Session = {
        id: authResponse.session.id,
        userId: user.id,
        expiresAt: authResponse.session.expiresAt,
        isActive: authResponse.session.isActive,
      };

      // Update store state
      setUser(user);
      setSession(session);
      setAuthenticated(true);
      setRequires2FA(authResponse.requires2FA || false);
      setLoading(false);

      return {
        success: true,
        user,
        session,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Login failed';

      // Update store with error state
      setError(errorMessage);
      setLoading(false);
      setAuthenticated(false);

      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  // Register business logic
  async register(data: RegisterData): Promise<void> {
    const { setLoading, setError } = useAuthStore.getState();

    setLoading(true);
    setError(null);

    try {
      // Call repository for API interaction
      await authRepository.register(data);

      // Registration successful
      setLoading(false);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Registration failed';

      // Update store with error state
      setError(errorMessage);
      setLoading(false);
      throw error;
    }
  }

  // Logout business logic
  async logout(): Promise<void> {
    const { setLoading, clearAuth } = useAuthStore.getState();

    setLoading(true);

    try {
      // Call repository for API interaction
      await authRepository.logout();

      // Clear auth state
      clearAuth();
    } catch (error) {
      console.error('Logout error:', error);
      // Force logout even if API call fails
      clearAuth();
    }
  }

  // OTP verification business logic
  async verifyOTP(code: string): Promise<void> {
    const { setLoading, setError, setRequires2FA } = useAuthStore.getState();

    setLoading(true);
    setError(null);

    try {
      // Call repository for API interaction
      await authRepository.verifyOTP({ code, type: 'totp' });

      // OTP verification successful
      setRequires2FA(false);
      setLoading(false);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'OTP verification failed';

      // Update store with error state
      setError(errorMessage);
      setLoading(false);
      throw error;
    }
  }

  // Check auth status business logic
  async checkAuthStatus(): Promise<boolean> {
    const { session, clearAuth } = useAuthStore.getState();

    try {
      console.log('Checking auth status');

      if (!session) return false;

      // Check if session is expired
      const isExpired = new Date() > new Date(session.expiresAt);
      if (isExpired) {
        clearAuth();
        return false;
      }

      // TODO: Call repository to validate session with backend when ready
      // await authRepository.validateSession(session.id);

      return true;
    } catch (error) {
      console.error('Auth status check failed:', error);
      clearAuth();
      return false;
    }
  }
}

// Export singleton instance
export const authService = new AuthService();

// Export convenience hooks for components to use
export const useAuthService = () => authService;

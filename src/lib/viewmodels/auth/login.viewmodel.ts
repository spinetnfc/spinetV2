'use client';

import { useState } from 'react';
import { z } from 'zod';
import { authRepository } from '@/lib/repositories/auth/auth-repository';
import {
  useSetUser,
  useSetSession,
  useSetAuthenticated,
  useSetAuthLoading,
  useSetAuthError,
} from '@/lib/store/auth/auth-store';
import type { LoginCredentials, AuthUser, Session } from '@/types/auth';

// Validation schema
const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginFieldErrors {
  email?: string;
  password?: string;
}

export const useLoginViewModel = () => {
  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<LoginFieldErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  // Store actions
  const setUser = useSetUser();
  const setSession = useSetSession();
  const setAuthenticated = useSetAuthenticated();
  const setAuthLoading = useSetAuthLoading();
  const setAuthError = useSetAuthError();

  // Validation
  const validateField = (field: keyof LoginFormData, value: string) => {
    try {
      if (field === 'email') {
        loginSchema.shape.email.parse(value);
      } else if (field === 'password') {
        loginSchema.shape.password.parse(value);
      }
      setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        setFieldErrors((prev) => ({
          ...prev,
          [field]: error.errors[0]?.message,
        }));
      }
      return false;
    }
  };

  const validateForm = (): boolean => {
    try {
      loginSchema.parse({ email, password });
      setFieldErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: LoginFieldErrors = {};
        error.errors.forEach((err) => {
          if (err.path[0] === 'email' || err.path[0] === 'password') {
            errors[err.path[0] as keyof LoginFieldErrors] = err.message;
          }
        });
        setFieldErrors(errors);
      }
      return false;
    }
  };

  // Handlers
  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (fieldErrors.email) {
      validateField('email', value);
    }
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (fieldErrors.password) {
      validateField('password', value);
    }
  };

  const handleEmailBlur = () => {
    validateField('email', email);
  };

  const handlePasswordBlur = () => {
    validateField('password', password);
  };

  // Main login handler
  const handleLogin = async () => {
    // Validate form
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setAuthLoading(true);
    setAuthError(null);

    try {
      const credentials: LoginCredentials = { email, password };

      // Call repository
      const authResponse = await authRepository.login(credentials);

      // Transform and update store
      const user: AuthUser = {
        id: authResponse.user.id,
        _id: authResponse.user.id, // Legacy compatibility
        email: authResponse.user.email,
        firstName: authResponse.user.firstName,
        lastName: authResponse.user.lastName,
        fullName: authResponse.user.fullName,
        isEmailVerified: authResponse.user.isEmailVerified,
        roles: authResponse.user.roles,
        selectedProfile: authResponse.user.selectedProfile || 'profile-dev-1',
        createdAt: authResponse.user.createdAt,
        updatedAt: authResponse.user.updatedAt,
      };

      const session: Session = {
        id: authResponse.session.id,
        userId: user.id,
        expiresAt: authResponse.session.expiresAt,
        isActive: authResponse.session.isActive,
      };

      // Update store
      setUser(user);
      setSession(session);
      setAuthenticated(true);

      console.log('Login successful:', { user, session });

      // TODO: Navigate to dashboard when router is ready
      // router.push(`/${locale}/app`);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Login failed';
      setAuthError(errorMessage);
      console.error('Login failed:', errorMessage);
    } finally {
      setIsLoading(false);
      setAuthLoading(false);
    }
  };

  return {
    // State
    email,
    password,
    fieldErrors,
    isLoading,

    // Handlers
    handleEmailChange,
    handlePasswordChange,
    handleEmailBlur,
    handlePasswordBlur,
    handleLogin,

    // Computed
    hasEmailError: !!fieldErrors.email,
    hasPasswordError: !!fieldErrors.password,
    canSubmit:
      email.length > 0 &&
      password.length > 0 &&
      !isLoading &&
      !fieldErrors.email &&
      !fieldErrors.password,
  };
};

import { useState, useMemo } from 'react';
import { z } from 'zod';
import { authRepository } from '@/lib/repositories/auth/auth-repository';
import {
  useSetUser,
  useSetSession,
  useSetAuthenticated,
  useSetAuthLoading,
  useSetAuthError,
} from '@/lib/store/auth/auth-store';
import { useClientTranslate } from '@/hooks/use-client-translate';
import type { OTPVerificationData, AuthUser, Session } from '@/types/auth';

interface OTPFieldErrors {
  code?: string;
}

export const useOTPVerificationViewModel = () => {
  const { t } = useClientTranslate();

  // Create validation schema with translated messages
  const otpSchema = useMemo(() => {
    return z.object({
      code: z
        .string()
        .min(6, t('auth.validation.otp-invalid'))
        .max(6, t('auth.validation.otp-invalid'))
        .regex(/^\d{6}$/, t('auth.validation.otp-invalid')),
    });
  }, [t]);

  // Form state
  const [code, setCode] = useState('');
  const [fieldErrors, setFieldErrors] = useState<OTPFieldErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);

  // Store actions
  const setUser = useSetUser();
  const setSession = useSetSession();
  const setAuthenticated = useSetAuthenticated();
  const setAuthLoading = useSetAuthLoading();
  const setAuthError = useSetAuthError();

  // Validation
  const validateField = (value: string) => {
    try {
      otpSchema.shape.code.parse(value);
      setFieldErrors((prev) => ({ ...prev, code: undefined }));
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        setFieldErrors((prev) => ({
          ...prev,
          code: error.errors[0]?.message,
        }));
      }
      return false;
    }
  };

  const validateForm = (): boolean => {
    try {
      otpSchema.parse({ code });
      setFieldErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: OTPFieldErrors = {};
        error.errors.forEach((err) => {
          if (err.path[0] === 'code') {
            errors.code = err.message;
          }
        });
        setFieldErrors(errors);
      }
      return false;
    }
  };

  // Handlers
  const handleCodeChange = (value: string) => {
    // Only allow digits and limit to 6 characters
    const cleanValue = value.replace(/\D/g, '').slice(0, 6);
    setCode(cleanValue);

    if (fieldErrors.code) {
      validateField(cleanValue);
    }
  };

  const handleCodeBlur = () => {
    validateField(code);
  };

  // Main OTP verification handler
  const handleVerifyOTP = async () => {
    // Validate form
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setAuthLoading(true);
    setAuthError(null);

    try {
      const otpData: OTPVerificationData = {
        code,
        type: 'totp', // Default to TOTP for now
      };

      console.log('OTP Verification Data:', otpData);

      // Call repository
      const authResponse = await authRepository.verifyOTP(otpData);

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

      console.log('OTP verification successful:', { user, session });

      // TODO: Navigate to dashboard when router is ready
      // router.push(`/${locale}/app`);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'OTP verification failed';
      setAuthError(errorMessage);
      console.error('OTP verification failed:', errorMessage);
    } finally {
      setIsLoading(false);
      setAuthLoading(false);
    }
  };

  // Resend OTP handler
  const handleResendCode = async () => {
    setIsResending(true);

    try {
      console.log('Clicked send code again');

      // TODO: Call API to resend OTP when backend is ready
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Mock delay

      // Clear any existing errors
      setAuthError(null);
      setFieldErrors({});

      console.log('Code resent successfully (mock)');
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to resend code';
      setAuthError(errorMessage);
      console.error('Resend code failed:', errorMessage);
    } finally {
      setIsResending(false);
    }
  };

  return {
    // State
    code,
    fieldErrors,
    isLoading,
    isResending,

    // Handlers
    handleCodeChange,
    handleCodeBlur,
    handleVerifyOTP,
    handleResendCode,

    // Computed
    hasCodeError: !!fieldErrors.code,
    canSubmit: code.length === 6 && !isLoading && !fieldErrors.code,
  };
};

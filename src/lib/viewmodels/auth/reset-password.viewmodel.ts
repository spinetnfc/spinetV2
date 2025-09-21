import { useState, useMemo } from 'react';
import { z } from 'zod';
import { authRepository } from '@/lib/repositories/auth/auth-repository';
import { useClientTranslate } from '@/hooks/use-client-translate';

interface ResetPasswordFieldErrors {
  password?: string;
  confirmPassword?: string;
}

export const useResetPasswordViewModel = () => {
  const { t } = useClientTranslate();

  // Create validation schema with translated messages
  const passwordSchema = useMemo(() => {
    return z.string().min(8, t('auth.validation.password-min'));
  }, [t]);

  const confirmPasswordSchema = useMemo(() => {
    return z.string().min(1, t('auth.validation.confirm-password-required'));
  }, [t]);

  const resetPasswordSchema = useMemo(() => {
    return z
      .object({
        password: passwordSchema,
        confirmPassword: confirmPasswordSchema,
      })
      .refine((data) => data.password === data.confirmPassword, {
        message: t('auth.validation.passwords-dont-match'),
        path: ['confirmPassword'],
      });
  }, [t, passwordSchema, confirmPasswordSchema]);

  // Form state
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<ResetPasswordFieldErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Validation
  const validateField = (
    field: 'password' | 'confirmPassword',
    value: string,
  ) => {
    try {
      if (field === 'password') {
        passwordSchema.parse(value);
        setFieldErrors((prev) => ({ ...prev, password: undefined }));

        // Also check confirm password if it exists
        if (confirmPassword && value !== confirmPassword) {
          setFieldErrors((prev) => ({
            ...prev,
            confirmPassword: t('auth.validation.passwords-dont-match'),
          }));
        } else if (confirmPassword && value === confirmPassword) {
          setFieldErrors((prev) => ({ ...prev, confirmPassword: undefined }));
        }
      } else {
        confirmPasswordSchema.parse(value);
        if (password !== value) {
          setFieldErrors((prev) => ({
            ...prev,
            confirmPassword: t('auth.validation.passwords-dont-match'),
          }));
        } else {
          setFieldErrors((prev) => ({ ...prev, confirmPassword: undefined }));
        }
      }
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
      resetPasswordSchema.parse({ password, confirmPassword });
      setFieldErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: ResetPasswordFieldErrors = {};
        error.errors.forEach((err) => {
          if (err.path[0] === 'password') {
            errors.password = err.message;
          } else if (err.path[0] === 'confirmPassword') {
            errors.confirmPassword = err.message;
          }
        });
        setFieldErrors(errors);
      }
      return false;
    }
  };

  // Handlers
  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (fieldErrors.password) {
      validateField('password', value);
    }
  };

  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value);
    if (fieldErrors.confirmPassword) {
      validateField('confirmPassword', value);
    }
  };

  const handlePasswordBlur = () => {
    validateField('password', password);
  };

  const handleConfirmPasswordBlur = () => {
    validateField('confirmPassword', confirmPassword);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  // Main reset password handler
  const handleResetPassword = async () => {
    // Validate form
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      console.log('Reset Password Data:', { password });

      // TODO: Call repository when backend is ready
      // await authRepository.resetPassword({ password, token: resetToken });

      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      console.log('Password reset successful (mock)');

      // TODO: Navigate to login page when router is ready
      // router.push(`/${locale}/auth/login`);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to reset password';
      console.error('Reset password failed:', errorMessage);

      // You could show an error toast here
      setFieldErrors({ password: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    // State
    password,
    confirmPassword,
    fieldErrors,
    isLoading,
    showPassword,
    showConfirmPassword,

    // Handlers
    handlePasswordChange,
    handleConfirmPasswordChange,
    handlePasswordBlur,
    handleConfirmPasswordBlur,
    handleResetPassword,
    togglePasswordVisibility,
    toggleConfirmPasswordVisibility,

    // Computed
    hasPasswordError: !!fieldErrors.password,
    hasConfirmPasswordError: !!fieldErrors.confirmPassword,
    canSubmit:
      password.length >= 8 &&
      confirmPassword.length > 0 &&
      password === confirmPassword &&
      !isLoading &&
      !fieldErrors.password &&
      !fieldErrors.confirmPassword,
  };
};

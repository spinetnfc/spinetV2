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
import type { RegisterCredentials, AuthUser, Session } from '@/types/auth';

type RegisterFormData = {
  email: string;
  password: string;
  confirmPassword: string;
};

interface RegisterFieldErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export const useRegisterViewModel = () => {
  const { t } = useClientTranslate();

  // Create base validation schema with translated messages
  const getBaseSchema = useMemo(() => {
    return z.object({
      email: z.string().email(t('auth.validation.email-required')),
      password: z.string().min(6, t('auth.validation.password-min')),
      confirmPassword: z
        .string()
        .min(1, t('auth.validation.confirm-password-required')),
    });
  }, [t]);

  // Create full validation schema with password confirmation
  const getValidationSchema = useMemo(() => {
    return getBaseSchema.refine(
      (data) => data.password === data.confirmPassword,
      {
        message: t('auth.validation.passwords-dont-match'),
        path: ['confirmPassword'],
      },
    );
  }, [getBaseSchema, t]);

  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<RegisterFieldErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  // Store actions
  const setUser = useSetUser();
  const setSession = useSetSession();
  const setAuthenticated = useSetAuthenticated();
  const setAuthLoading = useSetAuthLoading();
  const setAuthError = useSetAuthError();

  // Validation
  const validateField = (
    field: keyof RegisterFormData,
    value: string,
    allValues?: RegisterFormData,
  ) => {
    try {
      const valuesToValidate = allValues || {
        email,
        password,
        confirmPassword,
      };

      if (field === 'email') {
        getBaseSchema.shape.email.parse(value);
      } else if (field === 'password') {
        getBaseSchema.shape.password.parse(value);
      } else if (field === 'confirmPassword') {
        getBaseSchema.shape.confirmPassword.parse(value);
        // Also check if passwords match
        if (value !== valuesToValidate.password) {
          throw new z.ZodError([
            {
              code: z.ZodIssueCode.custom,
              message: t('auth.validation.passwords-dont-match'),
              path: ['confirmPassword'],
            },
          ]);
        }
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
      getValidationSchema.parse({ email, password, confirmPassword });
      setFieldErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: RegisterFieldErrors = {};
        error.errors.forEach((err) => {
          if (
            err.path[0] === 'email' ||
            err.path[0] === 'password' ||
            err.path[0] === 'confirmPassword'
          ) {
            errors[err.path[0] as keyof RegisterFieldErrors] = err.message;
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
    // Also revalidate confirm password if it has been filled
    if (confirmPassword && fieldErrors.confirmPassword) {
      validateField('confirmPassword', confirmPassword, {
        email,
        password: value,
        confirmPassword,
      });
    }
  };

  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value);
    if (fieldErrors.confirmPassword) {
      validateField('confirmPassword', value, {
        email,
        password,
        confirmPassword: value,
      });
    }
  };

  const handleEmailBlur = () => {
    validateField('email', email);
  };

  const handlePasswordBlur = () => {
    validateField('password', password);
  };

  const handleConfirmPasswordBlur = () => {
    validateField('confirmPassword', confirmPassword);
  };

  // Main register handler
  const handleRegister = async () => {
    // Validate form
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setAuthLoading(true);
    setAuthError(null);

    try {
      const credentials: RegisterCredentials = {
        email,
        password,
        confirmPassword,
      };

      // Call repository
      const authResponse = await authRepository.register(credentials);

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

      console.log('Registration successful:', { user, session });

      // TODO: Navigate to dashboard when router is ready
      // router.push(`/${locale}/app`);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Registration failed';
      setAuthError(errorMessage);
      console.error('Registration failed:', errorMessage);
    } finally {
      setIsLoading(false);
      setAuthLoading(false);
    }
  };

  return {
    // State
    email,
    password,
    confirmPassword,
    fieldErrors,
    isLoading,

    // Handlers
    handleEmailChange,
    handlePasswordChange,
    handleConfirmPasswordChange,
    handleEmailBlur,
    handlePasswordBlur,
    handleConfirmPasswordBlur,
    handleRegister,

    // Computed
    hasEmailError: !!fieldErrors.email,
    hasPasswordError: !!fieldErrors.password,
    hasConfirmPasswordError: !!fieldErrors.confirmPassword,
    canSubmit:
      email.length > 0 &&
      password.length > 0 &&
      confirmPassword.length > 0 &&
      !isLoading &&
      !fieldErrors.email &&
      !fieldErrors.password &&
      !fieldErrors.confirmPassword,
  };
};

import { useState, useMemo } from 'react';
import { z } from 'zod';
import { authRepository } from '@/lib/repositories/auth/auth-repository';
import { useClientTranslate } from '@/hooks/use-client-translate';

interface ForgotPasswordFieldErrors {
  email?: string;
}

export const useForgotPasswordViewModel = () => {
  const { t } = useClientTranslate();

  // Create validation schema with translated messages
  const forgotPasswordSchema = useMemo(() => {
    return z.object({
      email: z
        .string()
        .min(1, t('auth.validation.email-required'))
        .email(t('auth.validation.email-required')),
    });
  }, [t]);

  // Form state
  const [email, setEmail] = useState('');
  const [fieldErrors, setFieldErrors] = useState<ForgotPasswordFieldErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  // Validation
  const validateField = (field: 'email', value: string) => {
    try {
      forgotPasswordSchema.shape[field].parse(value);
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
      forgotPasswordSchema.parse({ email });
      setFieldErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: ForgotPasswordFieldErrors = {};
        error.errors.forEach((err) => {
          if (err.path[0] === 'email') {
            errors.email = err.message;
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

  const handleEmailBlur = () => {
    validateField('email', email);
  };

  // Main forgot password handler
  const handleForgotPassword = async () => {
    // Validate form
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      console.log('Forgot Password Data:', { email });

      // TODO: Call repository when backend is ready
      // await authRepository.requestPasswordReset({ email });

      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setEmailSent(true);
      console.log('Password reset email sent successfully (mock)');
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to send reset email';
      console.error('Forgot password failed:', errorMessage);

      // You could show an error toast here
      setFieldErrors({ email: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  // Handler for "Get new reset link"
  const handleGetNewLink = async () => {
    setEmailSent(false);
    setFieldErrors({});
    await handleForgotPassword();
  };

  return {
    // State
    email,
    fieldErrors,
    isLoading,
    emailSent,

    // Handlers
    handleEmailChange,
    handleEmailBlur,
    handleForgotPassword,
    handleGetNewLink,

    // Computed
    hasEmailError: !!fieldErrors.email,
    canSubmit: email.length > 0 && !isLoading && !fieldErrors.email,
  };
};

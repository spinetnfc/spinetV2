import { useState, useMemo } from 'react';
import { z } from 'zod';
import { useClientTranslate } from '@/hooks/use-client-translate';

interface SSOFieldErrors {
  email?: string;
}

export const useSSOViewModel = () => {
  const { t } = useClientTranslate();

  // Create validation schema with translated messages
  const ssoSchema = useMemo(() => {
    return z.object({
      email: z
        .string()
        .min(1, t('auth.validation.email-required'))
        .email(t('auth.validation.email-required')),
    });
  }, [t]);

  // Form state
  const [email, setEmail] = useState('');
  const [fieldErrors, setFieldErrors] = useState<SSOFieldErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  // Validation
  const validateField = (field: 'email', value: string) => {
    try {
      ssoSchema.shape[field].parse(value);
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
      ssoSchema.parse({ email });
      setFieldErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: SSOFieldErrors = {};
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

  // Main SSO handler
  const handleSSO = async () => {
    // Validate form
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      console.log('SSO Data:', { email });

      // TODO: Implement SSO authentication when backend is ready
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Mock delay

      console.log('SSO authentication successful (mock)');

      // TODO: Navigate to appropriate page when SSO is implemented
      // router.push(`/${locale}/app`);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'SSO authentication failed';
      console.error('SSO authentication failed:', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    // State
    email,
    fieldErrors,
    isLoading,

    // Handlers
    handleEmailChange,
    handleEmailBlur,
    handleSSO,

    // Computed
    hasEmailError: !!fieldErrors.email,
    canSubmit: email.length > 0 && !isLoading && !fieldErrors.email,
  };
};

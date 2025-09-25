import { useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useOnboardingStore } from '@/lib/store/onboarding/onboarding-store';
import { useClientTranslate } from '@/hooks/use-client-translate';
import { useLocale } from '@/hooks/use-locale';
import {
  OnboardingValidation,
  ValidationResult,
  formatUrl,
  formatName,
  isValidUrl,
  getHostname,
} from '@/lib/validations/onboarding.validation';
import type {
  OnboardingStep,
  UserLink,
  ProfileTheme,
  OrganizationMember,
  OrganizationData,
} from '@/types/onboarding';
import { apiClient } from '@/lib/api/axios';

export const useOnboardingViewModel = () => {
  const router = useRouter();
  const locale = useLocale();
  const { t } = useClientTranslate();

  // Store access (only data and simple mutations)
  const store = useOnboardingStore();

  // Initialize validation with translation
  const validation = useMemo(() => new OnboardingValidation(t), [t]);

  // === COMPUTED VALUES ===

  // Step information
  const getStepInfo = useCallback(
    (step: OnboardingStep) => {
      const stepInfo = {
        1: {
          title: t('onboarding.step1.title'),
          description: t('onboarding.step1.description'),
          skippable: false,
        },
        2: {
          title: t('onboarding.step2.title'),
          description: t('onboarding.step2.description'),
          skippable: true,
        },
        3: {
          title: t('onboarding.step3.title'),
          description: t('onboarding.step3.description'),
          skippable: true,
        },
        4: {
          title: t('onboarding.step4.title'),
          description: t('onboarding.step4.description'),
          skippable: false,
        },
        5: {
          title: t('onboarding.step5.title'),
          description: t('onboarding.step5.description'),
          skippable: true,
        },
      };

      return stepInfo[step];
    },
    [t],
  );

  // Check if step is skippable
  const isStepSkippable = useCallback((step: OnboardingStep): boolean => {
    switch (step) {
      case 1:
        return false; // Full name - not skippable
      case 2:
        return true; // Links - skippable
      case 3:
        return true; // Profile picture - skippable
      case 4:
        return false; // Theme - not skippable (has default)
      case 5:
        return true; // Organization - skippable
      default:
        return false;
    }
  }, []);

  // Get step progress percentage
  const getProgressPercentage = useCallback(() => {
    return (store.currentStep / 5) * 100;
  }, [store.currentStep]);

  // Check if it's the final step
  const isFinalStep = useCallback(() => {
    return store.currentStep === 5;
  }, [store.currentStep]);

  // Check if it's the first step
  const isFirstStep = useCallback(() => {
    return store.currentStep === 1;
  }, [store.currentStep]);

  // === VALIDATION ===

  // Validate current step
  const validateCurrentStep = useCallback((): ValidationResult => {
    return validation.validateStep(store.currentStep, store.data);
  }, [validation, store.currentStep, store.data]);

  // Check if user can proceed to next step
  const canProceedToNextStep = useCallback((): boolean => {
    const stepValidation = validateCurrentStep();

    // If step is skippable, user can always proceed
    if (isStepSkippable(store.currentStep)) {
      return true;
    }

    // Otherwise, validation must pass
    return stepValidation.isValid;
  }, [validateCurrentStep, isStepSkippable, store.currentStep]);

  // === STEP 1: FULL NAME ===

  const updateFullName = useCallback(
    (name: string) => {
      // Update store with raw input - don't format immediately
      store.updateField('fullName', name);

      // Clear any existing errors for this field
      store.clearError('fullName');

      // Async validation with debouncing
      setTimeout(() => {
        const validation = validateCurrentStep();
        if (!validation.isValid && validation.errors.fullName) {
          store.addError('fullName', validation.errors.fullName);
        }
      }, 300); // Add slight delay for better UX
    },
    [store, validateCurrentStep],
  );

  // === STEP 2: LINKS (ViewModel logic) ===

  // Map platformKey to value for UI
  const platformKeyToName: Record<string, string> = {
    facebook: 'Facebook',
    phone: 'Phone',
    gmail: 'Gmail',
    instagram: 'Instagram',
    whatsapp: 'WhatsApp',
    youtube: 'YouTube',
    linkedin: 'LinkedIn',
    pinterest: 'Pinterest',
    spotify: 'Spotify',
    tiktok: 'TikTok',
    snapchat: 'Snapchat',
    website: 'Website',
  };

  // Expose link values as { platformKey: value }
  const linkValues: Record<string, string> = {};
  (store.data.links || []).forEach((link) => {
    const platformKey = Object.keys(platformKeyToName).find(
      (key) => platformKeyToName[key] === link.platform,
    );
    if (platformKey) {
      linkValues[platformKey] = link.url;
    }
  });

  // Update or remove a link by platformKey
  const updateLink = useCallback(
    (platformKey: string, value: string) => {
      const platform = platformKeyToName[platformKey] || platformKey;
      if (!value || value.trim() === '') {
        // Remove link if value is empty
        const idx = store.data.links.findIndex(
          (link) => link.platform === platform,
        );
        if (idx !== -1) {
          const newLinks = store.data.links.filter((_, i) => i !== idx);
          store.updateField('links', newLinks);
        }
      } else {
        store.clearError('links');
        store.addLink(platform, value);
      }
    },
    [store],
  );

  // Remove a link by platformKey (for X button)
  const removeLinkByPlatform = useCallback(
    (platformKey: string) => {
      const platform = platformKeyToName[platformKey] || platformKey;
      const idx = store.data.links.findIndex(
        (link) => link.platform === platform,
      );
      if (idx !== -1) {
        const newLinks = store.data.links.filter((_, i) => i !== idx);
        store.updateField('links', newLinks);
      }
    },
    [store],
  );

  // === STEP 3: PROFILE PICTURE ===

  const uploadProfilePicture = useCallback(
    async (file: File): Promise<void> => {
      // Validate file
      const maxSize = 5 * 1024 * 1024; // 5MB
      const allowedTypes = [
        'image/jpeg',
        'image/png',
        'image/webp',
        'image/gif',
      ];

      if (file.size > maxSize) {
        store.addError('profilePicture', t('validation.file-too-large'));
        return;
      }

      if (!allowedTypes.includes(file.type)) {
        store.addError('profilePicture', t('validation.unsupported-file-type'));
        return;
      }

      store.setLoading(true);
      store.clearError('profilePicture');

      try {
        // TODO: Implement actual file upload
        // const uploadedUrl = await fileUploadService.upload(file);

        // Mock file upload
        const mockUrl = URL.createObjectURL(file);
        store.updateField('profilePicture', mockUrl);

        console.log('Profile picture uploaded (mock):', mockUrl);
      } catch (error) {
        console.error('Failed to upload profile picture:', error);
        store.addError('profilePicture', t('validation.upload-failed'));
      } finally {
        store.setLoading(false);
      }
    },
    [store, t],
  );

  const removeProfilePicture = useCallback(() => {
    store.updateField('profilePicture', null);
    store.clearError('profilePicture');
  }, [store]);

  // === STEP 4: THEME ===

  const selectTheme = useCallback(
    (theme: ProfileTheme) => {
      store.updateField('theme', theme);
      store.clearError('theme');
    },
    [store],
  );

  // === STEP 5: ORGANIZATION ===

  const updateOrganizationName = useCallback(
    (name: string) => {
      const formatted = formatName(name);

      if (!formatted && store.data.organization) {
        // If name is cleared, remove organization
        store.updateField('organization', null);
      } else if (formatted) {
        // Create or update organization
        const organization: OrganizationData = store.data.organization || {
          name: '',
          members: [],
        };
        store.updateField('organization', { ...organization, name: formatted });
      }

      store.clearError('organizationName');
    },
    [store],
  );

  const addOrganizationMember = useCallback(
    async (
      email: string,
      role: 'admin' | 'member' = 'member',
    ): Promise<boolean> => {
      const memberValidation = validation.validateOrganizationMember(
        email,
        role,
      );

      if (!memberValidation.isValid) {
        Object.entries(memberValidation.errors).forEach(([field, error]) => {
          store.addError(`member-${field}`, error);
        });
        return false;
      }

      // Check for duplicate emails
      const existingMembers = store.data.organization?.members || [];
      if (
        existingMembers.some(
          (member) => member.email.toLowerCase() === email.toLowerCase(),
        )
      ) {
        store.addError('member-email', t('validation.member-already-exists'));
        return false;
      }

      // Clear errors and add member using updateField
      store.clearError('member-email');
      store.clearError('member-role');

      // Add member to organization
      const currentOrg = store.data.organization || { name: '', members: [] };
      const newMembers = [...currentOrg.members, memberValidation.data];
      store.updateField('organization', { ...currentOrg, members: newMembers });
      return true;
    },
    [store, validation, t],
  );

  const removeOrganizationMember = useCallback(
    (index: number) => {
      // Remove member using updateField
      const currentOrg = store.data.organization;
      if (!currentOrg) return;

      const newMembers = currentOrg.members.filter((_, i) => i !== index);
      store.updateField('organization', { ...currentOrg, members: newMembers });
    },
    [store],
  );

  // === NAVIGATION ===

  const nextStep = useCallback(async () => {
    // No more pending links logic needed for Step 2. All links are persisted on change.

    // Validate current step
    const stepValidation = validateCurrentStep();

    if (!stepValidation.isValid) {
      // Set all errors
      store.setErrors(stepValidation.errors);
      return;
    }

    // Clear errors
    store.clearAllErrors();

    // Move to next step
    if (store.currentStep < 5) {
      store.setCurrentStep((store.currentStep + 1) as OnboardingStep);
    } else {
      // Complete onboarding on final step
      await completeOnboarding();
    }
  }, [store, validateCurrentStep, isValidUrl]);

  const previousStep = useCallback(() => {
    if (store.currentStep > 1) {
      store.setCurrentStep((store.currentStep - 1) as OnboardingStep);
      store.clearAllErrors();
    }
  }, [store]);

  const skipStep = useCallback(async () => {
    // If skipping step 2, clear all links before moving on
    if (isStepSkippable(store.currentStep)) {
      if (store.currentStep === 2) {
        store.updateField('links', []);
      }
      store.clearAllErrors();
      if (store.currentStep < 5) {
        store.setCurrentStep((store.currentStep + 1) as OnboardingStep);
      } else {
        // Will be handled when nextStep is called later
      }
    }
  }, [store, isStepSkippable]);

  const goToStep = useCallback(
    (step: OnboardingStep) => {
      // Only allow going to previous steps or current step
      if (step <= store.currentStep) {
        store.setCurrentStep(step);
        store.clearAllErrors();
      }
    },
    [store],
  );

  // === SUBMISSION ===

  const completeOnboarding = useCallback(async (): Promise<void> => {
    store.setLoading(true);
    store.clearAllErrors();

    try {
      // Final validation
      const completeValidation = validation.validateComplete(store.data);

      if (!completeValidation.isValid) {
        store.setErrors(completeValidation.errors);
        return;
      }

      // Log the final onboarding data
      console.log('Onboarding completed! Final data:', completeValidation.data);

      // TODO: Send data to backend API
      // await onboardingRepository.completeOnboarding(completeValidation.data);

      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      console.log('Onboarding data saved successfully (mock)');

      // Navigate to dashboard or home
      // router.push(`/${locale}`);
    } catch (error) {
      console.error('Failed to complete onboarding:', error);
      store.addError('general', t('validation.submission-failed'));
    } finally {
      store.setLoading(false);
    }
  }, [store, validation, router, locale, t]);

  // Submit onboarding data directly (bypassing some validations)
  const submitOnboardingData = useCallback(async () => {
    const submissionData = {
      ...store.data,
      links: store.data.links.filter((link) => link.url),
    };

    await apiClient.post('/onboarding/submit', submissionData);
  }, [store]);

  // === RESET ===

  const resetOnboarding = useCallback(() => {
    store.reset();
  }, [store]);

  const exitOnboarding = useCallback(() => {
    // TODO: Show confirmation dialog
    resetOnboarding();
    router.push(`/${locale}`);
  }, [resetOnboarding, router, locale]);

  // === RETURN INTERFACE ===

  return {
    // === STATE (from store) ===
    currentStep: store.currentStep,
    data: store.data,
    isLoading: store.isLoading,
    errors: store.errors,

    // === COMPUTED VALUES ===
    getStepInfo,
    getProgressPercentage,
    isFinalStep,
    isFirstStep,
    isStepSkippable,

    // === VALIDATION ===
    validateCurrentStep,
    canProceedToNextStep,

    // === STEP 1: FULL NAME ===
    updateFullName,

    // === STEP 2: LINKS ===
    linkValues,
    updateLink,
    removeLinkByPlatform,
    // Utility functions for components
    isValidUrl,
    getHostname,

    // === STEP 3: PROFILE PICTURE ===
    uploadProfilePicture,
    removeProfilePicture,

    // === STEP 4: THEME ===
    selectTheme,

    // === STEP 5: ORGANIZATION ===
    updateOrganizationName,
    addOrganizationMember,
    removeOrganizationMember,

    // === NAVIGATION ===
    nextStep,
    previousStep,
    skipStep,
    goToStep,

    // === SUBMISSION ===
    completeOnboarding,
    submitOnboardingData,

    // === RESET ===
    resetOnboarding,
    exitOnboarding,
  };
};

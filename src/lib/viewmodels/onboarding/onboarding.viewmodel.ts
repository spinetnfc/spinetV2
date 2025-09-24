import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useOnboardingStore } from '@/lib/store/onboarding/onboarding-store';
import { useClientTranslate } from '@/hooks/use-client-translate';
import type {
  OnboardingStep,
  UserLink,
  ProfileTheme,
  OrganizationMember,
} from '@/types/onboarding';

export const useOnboardingViewModel = () => {
  const router = useRouter();
  const { t } = useClientTranslate();

  // Store selectors
  const {
    currentStep,
    data,
    isLoading,
    errors,
    nextStep,
    previousStep,
    goToStep,
    updateFullName,
    updateLinks,
    addLink,
    removeLink,
    updateProfilePicture,
    updateTheme,
    updateOrganization,
    updateOrganizationName,
    addOrganizationMember,
    removeOrganizationMember,
    validateCurrentStep,
    canProceedToNextStep,
    isStepSkippable,
    skipCurrentStep,
    completeOnboarding,
    resetOnboarding,
  } = useOnboardingStore();

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

  // Navigation handlers
  const handleNext = useCallback(() => {
    const validation = validateCurrentStep();
    if (validation.isValid) {
      if (currentStep === 5) {
        // Complete onboarding on final step
        completeOnboarding();
      } else {
        nextStep();
      }
    }
  }, [currentStep, validateCurrentStep, nextStep, completeOnboarding]);

  const handlePrevious = useCallback(() => {
    previousStep();
  }, [previousStep]);

  const handleSkip = useCallback(() => {
    skipCurrentStep();
  }, [skipCurrentStep]);

  const handleGoToStep = useCallback(
    (step: OnboardingStep) => {
      // Only allow going to previous steps or current step
      if (step <= currentStep) {
        goToStep(step);
      }
    },
    [currentStep, goToStep],
  );

  // Step 1: Full name handlers
  const handleFullNameChange = useCallback(
    (name: string) => {
      updateFullName(name);
    },
    [updateFullName],
  );

  // Step 2: Links handlers
  const handleAddLink = useCallback(
    (platform: string, url: string) => {
      if (platform && url) {
        addLink({ platform, url });
      }
    },
    [addLink],
  );

  const handleRemoveLink = useCallback(
    (index: number) => {
      removeLink(index);
    },
    [removeLink],
  );

  const handleUpdateLinks = useCallback(
    (links: UserLink[]) => {
      updateLinks(links);
    },
    [updateLinks],
  );

  // Step 3: Profile picture handlers
  const handleProfilePictureChange = useCallback(
    (picture: string | null) => {
      updateProfilePicture(picture);
    },
    [updateProfilePicture],
  );

  const handleProfilePictureUpload = useCallback(
    async (file: File): Promise<void> => {
      try {
        // TODO: Implement actual file upload
        // const uploadedUrl = await fileUploadService.upload(file);

        // Mock file upload
        const mockUrl = URL.createObjectURL(file);
        updateProfilePicture(mockUrl);

        console.log('Profile picture uploaded (mock):', mockUrl);
      } catch (error) {
        console.error('Failed to upload profile picture:', error);
      }
    },
    [updateProfilePicture],
  );

  // Step 4: Theme handlers
  const handleThemeChange = useCallback(
    (theme: ProfileTheme) => {
      updateTheme(theme);
    },
    [updateTheme],
  );

  // Step 5: Organization handlers
  const handleOrganizationNameChange = useCallback(
    (name: string) => {
      updateOrganizationName(name);
    },
    [updateOrganizationName],
  );

  const handleAddOrganizationMember = useCallback(
    (email: string, role: 'admin' | 'member' = 'member') => {
      if (email) {
        addOrganizationMember({
          email,
          role,
          status: 'pending',
        });
      }
    },
    [addOrganizationMember],
  );

  const handleRemoveOrganizationMember = useCallback(
    (index: number) => {
      removeOrganizationMember(index);
    },
    [removeOrganizationMember],
  );

  const handleSkipOrganization = useCallback(() => {
    updateOrganization(null);
    completeOnboarding();
  }, [updateOrganization, completeOnboarding]);

  // Exit onboarding
  const handleExitOnboarding = useCallback(() => {
    // TODO: Show confirmation dialog
    resetOnboarding();
    router.push('/');
  }, [resetOnboarding, router]);

  // Get current step validation status
  const getCurrentStepValidation = useCallback(() => {
    return validateCurrentStep();
  }, [validateCurrentStep]);

  // Check if user can proceed
  const canProceed = useCallback(() => {
    return canProceedToNextStep();
  }, [canProceedToNextStep]);

  // Get step progress percentage
  const getProgressPercentage = useCallback(() => {
    return (currentStep / 5) * 100;
  }, [currentStep]);

  // Check if it's the final step
  const isFinalStep = useCallback(() => {
    return currentStep === 5;
  }, [currentStep]);

  // Check if it's the first step
  const isFirstStep = useCallback(() => {
    return currentStep === 1;
  }, [currentStep]);

  return {
    // State
    currentStep,
    data,
    isLoading,
    errors,

    // Step information
    getStepInfo,
    getCurrentStepValidation,
    canProceed,
    getProgressPercentage,
    isFinalStep,
    isFirstStep,

    // Navigation
    handleNext,
    handlePrevious,
    handleSkip,
    handleGoToStep,
    handleExitOnboarding,

    // Step 1: Full name
    handleFullNameChange,

    // Step 2: Links
    handleAddLink,
    handleRemoveLink,
    handleUpdateLinks,

    // Step 3: Profile picture
    handleProfilePictureChange,
    handleProfilePictureUpload,

    // Step 4: Theme
    handleThemeChange,

    // Step 5: Organization
    handleOrganizationNameChange,
    handleAddOrganizationMember,
    handleRemoveOrganizationMember,
    handleSkipOrganization,

    // Utilities
    isStepSkippable: (step: OnboardingStep) => isStepSkippable(step),
  };
};

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  type OnboardingStep,
  type OnboardingData,
  type OnboardingState,
  type OnboardingActions,
  type UserLink,
  type ProfileTheme,
  type OrganizationData,
  type OrganizationMember,
  type StepValidation,
  DEFAULT_PROFILE_THEMES,
} from '@/types/onboarding';

// Initial onboarding data
const initialOnboardingData: OnboardingData = {
  fullName: '',
  links: [],
  profilePicture: null,
  theme: DEFAULT_PROFILE_THEMES[0], // Default to first theme
  organization: null,
};

// Initial state
const initialState: OnboardingState = {
  currentStep: 1,
  data: initialOnboardingData,
  isLoading: false,
  errors: {},
};

type OnboardingStore = OnboardingState & OnboardingActions;

export const useOnboardingStore = create<OnboardingStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      // Navigation actions
      nextStep: () => {
        const { currentStep, canProceedToNextStep } = get();
        if (canProceedToNextStep() && currentStep < 5) {
          set({ currentStep: (currentStep + 1) as OnboardingStep, errors: {} });
        }
      },

      previousStep: () => {
        const { currentStep } = get();
        if (currentStep > 1) {
          set({ currentStep: (currentStep - 1) as OnboardingStep, errors: {} });
        }
      },

      goToStep: (step: OnboardingStep) => {
        set({ currentStep: step, errors: {} });
      },

      // Data management actions
      updateFullName: (fullName: string) => {
        set((state) => ({
          data: { ...state.data, fullName },
          errors: { ...state.errors, fullName: '' },
        }));
      },

      updateLinks: (links: UserLink[]) => {
        set((state) => ({
          data: { ...state.data, links },
        }));
      },

      addLink: (link: UserLink) => {
        set((state) => ({
          data: { ...state.data, links: [...state.data.links, link] },
        }));
      },

      removeLink: (index: number) => {
        set((state) => ({
          data: {
            ...state.data,
            links: state.data.links.filter((_, i) => i !== index),
          },
        }));
      },

      updateProfilePicture: (profilePicture: string | null) => {
        set((state) => ({
          data: { ...state.data, profilePicture },
        }));
      },

      updateTheme: (theme: ProfileTheme) => {
        set((state) => ({
          data: { ...state.data, theme },
        }));
      },

      updateOrganization: (organization: OrganizationData | null) => {
        set((state) => ({
          data: { ...state.data, organization },
        }));
      },

      // Organization sub-actions
      updateOrganizationName: (name: string) => {
        set((state) => {
          const organization = state.data.organization || {
            name: '',
            members: [],
          };
          return {
            data: {
              ...state.data,
              organization: { ...organization, name },
            },
          };
        });
      },

      addOrganizationMember: (member: OrganizationMember) => {
        set((state) => {
          const organization = state.data.organization || {
            name: '',
            members: [],
          };
          return {
            data: {
              ...state.data,
              organization: {
                ...organization,
                members: [...organization.members, member],
              },
            },
          };
        });
      },

      removeOrganizationMember: (index: number) => {
        set((state) => {
          const organization = state.data.organization;
          if (!organization) return state;

          return {
            data: {
              ...state.data,
              organization: {
                ...organization,
                members: organization.members.filter((_, i) => i !== index),
              },
            },
          };
        });
      },

      // Validation and progression
      validateCurrentStep: (): StepValidation => {
        const { currentStep, data } = get();
        const errors: Record<string, string> = {};

        switch (currentStep) {
          case 1:
            if (!data.fullName || data.fullName.trim().length === 0) {
              errors.fullName = 'Please enter your full name';
            }
            break;

          case 2:
            // Links are optional, but if provided should be valid
            data.links.forEach((link, index) => {
              if (!isValidUrl(link.url)) {
                errors[`link-${index}-url`] = 'Please enter a valid URL';
              }
            });
            break;

          case 3:
            // Profile picture is optional
            break;

          case 4:
            if (!data.theme || !data.theme.id) {
              errors.theme = 'Please select a theme';
            }
            break;

          case 5:
            // Organization is optional, but if provided should be valid
            if (data.organization) {
              if (!data.organization.name.trim()) {
                errors.organizationName = 'Organization name is required';
              }

              data.organization.members.forEach((member, index) => {
                if (!isValidEmail(member.email)) {
                  errors[`member-${index}-email`] =
                    'Please enter a valid email';
                }
              });
            }
            break;
        }

        const isValid = Object.keys(errors).length === 0;

        // Only update state if errors have changed to avoid unnecessary re-renders
        const currentErrors = get().errors;
        const errorsChanged =
          JSON.stringify(currentErrors) !== JSON.stringify(errors);
        if (errorsChanged) {
          set({ errors });
        }

        return { isValid, errors };
      },

      canProceedToNextStep: (): boolean => {
        const { currentStep, data, isStepSkippable } = get();

        // Quick validation without side effects
        switch (currentStep) {
          case 1:
            return data.fullName.trim().length > 0;
          case 2:
          case 3:
          case 5:
            return true; // These steps are skippable
          case 4:
            return !!(data.theme && data.theme.id);
          default:
            return false;
        }
      },

      isStepSkippable: (step: OnboardingStep): boolean => {
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
      },

      skipCurrentStep: () => {
        const { currentStep, isStepSkippable, nextStep } = get();
        if (isStepSkippable(currentStep)) {
          nextStep();
        }
      },

      completeOnboarding: async (): Promise<void> => {
        set({ isLoading: true });

        try {
          const { data } = get();

          // Log the final onboarding data
          console.log('Onboarding completed! Final data:', {
            fullName: data.fullName,
            links: data.links,
            profilePicture: data.profilePicture,
            theme: data.theme,
            organization: data.organization,
          });

          // TODO: Send data to backend API
          // await onboardingRepository.completeOnboarding(data);

          // Mock API call
          await new Promise((resolve) => setTimeout(resolve, 1500));

          console.log('Onboarding data saved successfully (mock)');

          // TODO: Navigate to dashboard
          // router.push('/app/dashboard');
        } catch (error) {
          console.error('Failed to complete onboarding:', error);
          set({
            errors: {
              general: 'Failed to complete onboarding. Please try again.',
            },
          });
        } finally {
          set({ isLoading: false });
        }
      },

      resetOnboarding: () => {
        set(initialState);
      },
    }),
    {
      name: 'onboarding-storage',
      partialize: (state) => ({
        currentStep: state.currentStep,
        data: state.data,
      }),
    },
  ),
);

// Helper functions
function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Selectors for easier access
export const useOnboardingCurrentStep = () =>
  useOnboardingStore((state) => state.currentStep);
export const useOnboardingData = () =>
  useOnboardingStore((state) => state.data);
export const useOnboardingIsLoading = () =>
  useOnboardingStore((state) => state.isLoading);
export const useOnboardingErrors = () =>
  useOnboardingStore((state) => state.errors);

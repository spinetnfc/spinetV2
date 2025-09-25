import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  type OnboardingStep,
  type OnboardingData,
  type UserLink,
  type ProfileTheme,
  type OrganizationData,
  type OrganizationMember,
  DEFAULT_PROFILE_THEMES,
} from '@/types/onboarding';

// Simplified store state interface
interface OnboardingStoreState {
  data: OnboardingData;
  currentStep: OnboardingStep;
  isLoading: boolean;
  errors: Record<string, string>;
}

// Pure data store actions interface - only basic mutations
interface OnboardingStoreActions {
  // Pure data mutations
  setData: (data: OnboardingData) => void;
  updateField: <K extends keyof OnboardingData>(
    field: K,
    value: OnboardingData[K],
  ) => void;

  // Navigation
  setCurrentStep: (step: OnboardingStep) => void;

  // Loading state
  setLoading: (loading: boolean) => void;

  // Error management
  setErrors: (errors: Record<string, string>) => void;
  addError: (field: string, error: string) => void;
  clearError: (field: string) => void;
  clearAllErrors: () => void;

  // Reset
  reset: () => void;

  // Add a link for a platform
  addLink: (platform: string, url: string) => void;
}

type OnboardingStore = OnboardingStoreState & OnboardingStoreActions;

// Initial onboarding data
const initialOnboardingData: OnboardingData = {
  fullName: '',
  links: [],
  profilePicture: null,
  theme: DEFAULT_PROFILE_THEMES[0], // Default to first theme
  organization: null,
};

// Initial state
const initialState: OnboardingStoreState = {
  currentStep: 1,
  data: initialOnboardingData,
  isLoading: false,
  errors: {},
};

export const useOnboardingStore = create<OnboardingStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      // === DATA MUTATIONS ===
      setData: (data: OnboardingData) => {
        set({ data });
      },

      updateField: <K extends keyof OnboardingData>(
        field: K,
        value: OnboardingData[K],
      ) => {
        set((state) => ({
          data: { ...state.data, [field]: value },
        }));
      },

      // Add a link for a platform
      addLink: (platform: string, url: string) => {
        set((state) => {
          let updatedLinks = [...state.data.links];
          const existingIndex = updatedLinks.findIndex(
            (link) => link.platform === platform,
          );

          if (!url || url.trim() === '') {
            // Remove the link if url is empty
            if (existingIndex !== -1) {
              updatedLinks.splice(existingIndex, 1);
            }
          } else {
            if (existingIndex !== -1) {
              updatedLinks[existingIndex] = { platform, url };
            } else {
              updatedLinks.push({ platform, url });
            }
          }

          return {
            data: {
              ...state.data,
              links: updatedLinks,
            },
          };
        });
      },

      // === NAVIGATION ===
      setCurrentStep: (step: OnboardingStep) => {
        set({ currentStep: step });
      },

      // === LOADING STATE ===
      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      // === ERROR MANAGEMENT ===
      setErrors: (errors: Record<string, string>) => {
        set({ errors });
      },

      addError: (field: string, error: string) => {
        set((state) => ({
          errors: { ...state.errors, [field]: error },
        }));
      },

      clearError: (field: string) => {
        set((state) => {
          const { [field]: _, ...remainingErrors } = state.errors;
          return { errors: remainingErrors };
        });
      },

      clearAllErrors: () => {
        set({ errors: {} });
      },

      // === RESET ===
      reset: () => {
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

// Selectors for easier access (optional - components can use ViewModel instead)
export const useOnboardingCurrentStep = () =>
  useOnboardingStore((state) => state.currentStep);
export const useOnboardingData = () =>
  useOnboardingStore((state) => state.data);
export const useOnboardingIsLoading = () =>
  useOnboardingStore((state) => state.isLoading);
export const useOnboardingErrors = () =>
  useOnboardingStore((state) => state.errors);

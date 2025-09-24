// Onboarding step types
export type OnboardingStep = 1 | 2 | 3 | 4 | 5;

// User links for step 2
export interface UserLink {
  platform: string;
  url: string;
}

// Profile theme for step 4
export interface ProfileTheme {
  id: string;
  name: string;
  textColor: string;
  backgroundColor: string;
  primaryColor: string;
}

// Organization data for step 5
export interface OrganizationData {
  name: string;
  members: OrganizationMember[];
}

export interface OrganizationMember {
  email: string;
  role: 'admin' | 'member';
  status: 'pending' | 'accepted';
}

// Complete onboarding data
export interface OnboardingData {
  // Step 1: Full name (required)
  fullName: string;

  // Step 2: User links (optional)
  links: UserLink[];

  // Step 3: Profile picture (optional)
  profilePicture: string | null;

  // Step 4: Profile theme (required - has default)
  theme: ProfileTheme;

  // Step 5: Organization (optional)
  organization: OrganizationData | null;
}

// Onboarding state
export interface OnboardingState {
  currentStep: OnboardingStep;
  data: OnboardingData;
  isLoading: boolean;
  errors: Record<string, string>;
}

// Step validation result
export interface StepValidation {
  isValid: boolean;
  errors: Record<string, string>;
}

// Onboarding actions
export interface OnboardingActions {
  // Navigation
  nextStep: () => void;
  previousStep: () => void;
  goToStep: (step: OnboardingStep) => void;

  // Data management
  updateFullName: (fullName: string) => void;
  updateLinks: (links: UserLink[]) => void;
  addLink: (link: UserLink) => void;
  removeLink: (index: number) => void;
  updateProfilePicture: (picture: string | null) => void;
  updateTheme: (theme: ProfileTheme) => void;
  updateOrganization: (organization: OrganizationData | null) => void;

  // Organization sub-steps
  updateOrganizationName: (name: string) => void;
  addOrganizationMember: (member: OrganizationMember) => void;
  removeOrganizationMember: (index: number) => void;

  // Validation and submission
  validateCurrentStep: () => StepValidation;
  canProceedToNextStep: () => boolean;
  isStepSkippable: (step: OnboardingStep) => boolean;
  skipCurrentStep: () => void;
  completeOnboarding: () => Promise<void>;

  // Reset
  resetOnboarding: () => void;
}

// Default profile themes
export const DEFAULT_PROFILE_THEMES: ProfileTheme[] = [
  {
    id: 'blue-theme',
    name: 'Professional Blue',
    textColor: '#1a1a1a',
    backgroundColor: '#E2E8F0',
    primaryColor: '#2563eb',
  },
  {
    id: 'green-theme',
    name: 'Nature Green',
    textColor: '#1a1a1a',
    backgroundColor: '#f0fdf4',
    primaryColor: '#16a34a',
  },
  {
    id: 'purple-theme',
    name: 'Creative Purple',
    textColor: '#1a1a1a',
    backgroundColor: '#faf5ff',
    primaryColor: '#9333ea',
  },
  {
    id: 'orange-theme',
    name: 'Energetic Orange',
    textColor: '#1a1a1a',
    backgroundColor: '#fff7ed',
    primaryColor: '#ea580c',
  },
  {
    id: 'dark-theme',
    name: 'Dark Mode',
    textColor: '#ffffff',
    backgroundColor: '#1a1a1a',
    primaryColor: '#60a5fa',
  },
];

// Authentication related types
export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

export interface AuthUser {
  id: string;
  _id?: string; // Legacy compatibility
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  isEmailVerified: boolean;
  roles: string[];
  selectedProfile?: string; // Legacy compatibility
  createdAt: string;
  updatedAt: string;
}

export interface Session {
  id: string;
  userId: string;
  expiresAt: string;
  isActive: boolean;
  deviceInfo?: {
    userAgent: string;
    ip: string;
    location?: string;
  };
}

export interface AuthResponse {
  user: AuthUser;
  session: Session;
  requires2FA: boolean;
  message?: string;
}

export interface LoginResult {
  success: boolean;
  user?: AuthUser;
  session?: Session;
  requires2FA?: boolean;
  error?: string;
}

export interface OTPVerificationData {
  code: string;
  type: 'totp' | 'sms';
}

export interface PasswordResetData {
  email: string;
}

export interface PasswordResetConfirmData {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface SocialProvider {
  type: 'google' | 'facebook' | 'apple';
  name: string;
  clientId: string;
}

export interface SSOConfig {
  provider: string;
  redirectUrl: string;
  clientId: string;
}

// Authentication state
export interface AuthState {
  user: AuthUser | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  requires2FA: boolean;
  error: string | null;
}

// Session state
export interface SessionState {
  currentSession: Session | null;
  isValidating: boolean;
  lastValidated: Date | null;
  error: string | null;
}

// Legacy types (keeping for backward compatibility during migration)
export type NewUser = {
  email: string;
  password: string;
  firstName: string;
  lastName?: string;
  birthDate?: string;
  gender?: 'male' | 'female' | 'other';
  companyName?: string;
  activitySector?: string;
  position?: string;
  phoneNumber?: string;
  website?: string;
  language?: string;
  theme?: {
    color: string;
  };
};

export type LoginUser = {
  email: string;
  password: string;
};

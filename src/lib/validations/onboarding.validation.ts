import { z } from 'zod';
import { OnboardingStep } from '@/types/onboarding';

// Helper function to create validation message with translation
const createTranslatedSchema = (t: (key: string, values?: any) => string) => {
  // Step 1: Full Name Schema
  const step1Schema = z.object({
    fullName: z
      .string()
      .min(1, t('validation.required'))
      .min(2, t('validation.name-too-short'))
      .max(100, t('validation.name-too-long'))
      .regex(/^[a-zA-Z\s]+$/, t('validation.name-invalid-characters'))
      .refine((name) => {
        const words = name.trim().split(/\s+/);
        return words.length >= 2;
      }, t('validation.name-two-words-required'))
      .transform((name) => name.trim().replace(/\s+/g, ' ')), // Format: trim and normalize spaces
  });

  // Step 2: Links Schema
  const linkSchema = z.object({
    platform: z
      .string()
      .min(1, t('validation.platform-required'))
      .max(50, t('validation.platform-too-long')),
    url: z
      .string()
      .min(1, t('validation.url-required'))
      .url(t('validation.url-invalid'))
      .transform((url) => {
        // Format URL: ensure it has protocol
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
          return `https://${url}`;
        }
        return url;
      }),
  });

  const step2Schema = z.object({
    links: z
      .array(linkSchema)
      .max(10, t('validation.too-many-links'))
      .optional()
      .default([]),
  });

  // Step 3: Profile Picture Schema
  const step3Schema = z.object({
    profilePicture: z
      .string()
      .url(t('validation.profile-picture-invalid-url'))
      .nullable()
      .optional(),
  });

  // Step 4: Theme Schema
  const step4Schema = z.object({
    theme: z.object({
      id: z.string().min(1, t('validation.theme-required')),
      name: z.string().min(1, t('validation.theme-name-required')),
      textColor: z
        .string()
        .regex(/^#[0-9A-F]{6}$/i, t('validation.invalid-color')),
      backgroundColor: z
        .string()
        .regex(/^#[0-9A-F]{6}$/i, t('validation.invalid-color')),
      primaryColor: z
        .string()
        .regex(/^#[0-9A-F]{6}$/i, t('validation.invalid-color')),
    }),
  });

  // Step 5: Organization Schema
  const organizationMemberSchema = z.object({
    email: z
      .string()
      .min(1, t('validation.email-required'))
      .email(t('validation.email-invalid'))
      .toLowerCase(),
    role: z.enum(['admin', 'member'], {
      errorMap: () => ({ message: t('validation.role-invalid') }),
    }),
    status: z.enum(['pending', 'accepted'], {
      errorMap: () => ({ message: t('validation.status-invalid') }),
    }),
  });

  const organizationSchema = z.object({
    name: z
      .string()
      .min(1, t('validation.organization-name-required'))
      .min(2, t('validation.organization-name-too-short'))
      .max(100, t('validation.organization-name-too-long'))
      .transform((name) => name.trim()),
    members: z
      .array(organizationMemberSchema)
      .max(50, t('validation.too-many-members'))
      .default([]),
  });

  const step5Schema = z.object({
    organization: organizationSchema.nullable().optional(),
  });

  // Complete onboarding data schema
  const completeOnboardingSchema = z.object({
    fullName: step1Schema.shape.fullName,
    links: step2Schema.shape.links,
    profilePicture: step3Schema.shape.profilePicture,
    theme: step4Schema.shape.theme,
    organization: step5Schema.shape.organization,
  });

  return {
    step1Schema,
    step2Schema,
    step3Schema,
    step4Schema,
    step5Schema,
    completeOnboardingSchema,
    linkSchema,
    organizationMemberSchema,
  };
};

// Validation result type
export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
  data?: any;
}

// Validation utilities
export class OnboardingValidation {
  private schemas: ReturnType<typeof createTranslatedSchema>;
  private t: (key: string, values?: any) => string;

  constructor(t: (key: string, values?: any) => string) {
    this.t = t;
    this.schemas = createTranslatedSchema(t);
  }

  // Validate individual step
  validateStep(step: OnboardingStep, data: any): ValidationResult {
    try {
      let schema;
      let stepData;

      switch (step) {
        case 1:
          schema = this.schemas.step1Schema;
          stepData = { fullName: data.fullName };
          break;
        case 2:
          schema = this.schemas.step2Schema;
          stepData = { links: data.links };
          break;
        case 3:
          schema = this.schemas.step3Schema;
          stepData = { profilePicture: data.profilePicture };
          break;
        case 4:
          schema = this.schemas.step4Schema;
          stepData = { theme: data.theme };
          break;
        case 5:
          schema = this.schemas.step5Schema;
          stepData = { organization: data.organization };
          break;
        default:
          return {
            isValid: false,
            errors: { general: this.t('validation.invalid-step') },
          };
      }

      const result = schema.safeParse(stepData);

      if (result.success) {
        return {
          isValid: true,
          errors: {},
          data: result.data,
        };
      } else {
        const errors: Record<string, string> = {};
        result.error.issues.forEach((issue) => {
          const fieldPath = issue.path.join('.');
          errors[fieldPath] = issue.message;
        });

        return {
          isValid: false,
          errors,
        };
      }
    } catch (error) {
      return {
        isValid: false,
        errors: { general: this.t('validation.unexpected-error') },
      };
    }
  }

  // Validate complete onboarding data
  validateComplete(data: any): ValidationResult {
    try {
      const result = this.schemas.completeOnboardingSchema.safeParse(data);

      if (result.success) {
        return {
          isValid: true,
          errors: {},
          data: result.data,
        };
      } else {
        const errors: Record<string, string> = {};
        result.error.issues.forEach((issue) => {
          const fieldPath = issue.path.join('.');
          errors[fieldPath] = issue.message;
        });

        return {
          isValid: false,
          errors,
        };
      }
    } catch (error) {
      return {
        isValid: false,
        errors: { general: this.t('validation.unexpected-error') },
      };
    }
  }

  // Validate individual link
  validateLink(platform: string, url: string): ValidationResult {
    try {
      const result = this.schemas.linkSchema.safeParse({ platform, url });

      if (result.success) {
        return {
          isValid: true,
          errors: {},
          data: result.data,
        };
      } else {
        const errors: Record<string, string> = {};
        result.error.issues.forEach((issue) => {
          errors[issue.path[0]] = issue.message;
        });

        return {
          isValid: false,
          errors,
        };
      }
    } catch (error) {
      return {
        isValid: false,
        errors: { general: this.t('validation.unexpected-error') },
      };
    }
  }

  // Validate organization member
  validateOrganizationMember(
    email: string,
    role: 'admin' | 'member',
  ): ValidationResult {
    try {
      const result = this.schemas.organizationMemberSchema.safeParse({
        email,
        role,
        status: 'pending',
      });

      if (result.success) {
        return {
          isValid: true,
          errors: {},
          data: result.data,
        };
      } else {
        const errors: Record<string, string> = {};
        result.error.issues.forEach((issue) => {
          errors[issue.path[0]] = issue.message;
        });

        return {
          isValid: false,
          errors,
        };
      }
    } catch (error) {
      return {
        isValid: false,
        errors: { general: this.t('validation.unexpected-error') },
      };
    }
  }
}

// Utility functions
export const formatUrl = (url: string): string => {
  if (!url) return '';

  const trimmed = url.trim();
  if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
    return `https://${trimmed}`;
  }
  return trimmed;
};

export const formatName = (name: string): string => {
  return name.trim().replace(/\s+/g, ' ');
};

export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const getHostname = (url: string): string => {
  try {
    return new URL(url).hostname;
  } catch {
    return 'Invalid URL';
  }
};

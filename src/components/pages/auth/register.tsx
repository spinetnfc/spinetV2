'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FormattedMessage, IntlProvider, useIntl } from 'react-intl';
import * as z from 'zod';
import type { NewUser } from '@/types/api';
import { registerUser } from '@/lib/api/auth';
import FacebookIcon from '@/components/icons/facebook-icon';
import GoogleIcon from '@/components/icons/google-icon';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/utils/cn';
import { ColorPicker } from '@/components/ui/color-picker';

const registerSchema = z.object({
  // Personal Info
  email: z.string().email({ message: 'invalid-email-address' }),
  firstName: z.string().min(2, { message: 'firstname-required' }),
  lastName: z.string().min(2, { message: 'lastname-required' }),
  birthDate: z.date().optional(),
  gender: z.enum(['male', 'female', 'other']).optional(),
  phoneNumber: z
    .string()
    .min(1, { message: 'phone-number-required' })
    .regex(/^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/, {
      message: 'invalid-phone-number',
    }),
  website: z
    .string()
    .min(1, { message: 'website-required' })
    .regex(
      /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/,
      { message: 'invalid-website' },
    ),

  // Company Info
  companyName: z.string().min(1, { message: 'company-name-required' }),
  activitySector: z.string().min(1, { message: 'activity-sector-required' }),
  position: z.string().min(1, { message: 'position-required' }),

  // Customization
  language: z.enum(['en', 'fr', 'ar']).default('en'),
  theme: z
    .object({
      color: z.string().default('#0F62FE'),
    })
    .default({ color: '#0F62FE' }),

  // Password
  password: z.string().min(8, { message: 'password-length' }),
  passwordConfirmation: z.string().min(8, { message: 'password-length' }),
}).refine((data) => data.password === data.passwordConfirmation, {
  message: 'passwords-must-match',
  path: ['passwordConfirmation'],
});

export default function Register({ locale, messages }: { locale: string; messages: Record<string, string> }) {
  return (
    <IntlProvider locale={locale} messages={messages}>
      <RegisterForm locale={locale} />
    </IntlProvider>
  );
}

const RegisterForm = ({ locale }: { locale: string }) => {
  const intl = useIntl();
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const totalSteps = 4;

  // Initialize form
  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      firstName: '',
      lastName: '',
      phoneNumber: '',
      website: '',
      companyName: '',
      activitySector: '',
      position: '',
      language: 'en',
      theme: { color: '#0F62FE' },
      password: '',
      passwordConfirmation: '',
    },
  });

  const nextStep = async () => {
    let fieldsToValidate: string[] = [];

    switch (step) {
      case 1:
        fieldsToValidate = ['email', 'firstName', 'lastName', 'phoneNumber', 'website'];
        break;
      case 2:
        fieldsToValidate = ['companyName', 'activitySector', 'position'];
        break;
      case 3:
        fieldsToValidate = ['language', 'theme.color'];
        break;
      case 4:
        fieldsToValidate = ['password', 'passwordConfirmation'];
        break;
    }

    const result = await form.trigger(fieldsToValidate as any);
    if (result) {
      if (step < totalSteps) {
        setStep((prev) => prev + 1);
      }
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep((prev) => prev - 1);
      setApiError(null);
    }
  };

  // Handle form submission
  const onSubmit = async (data: z.infer<typeof registerSchema>) => {
    setIsSubmitting(true);
    setApiError(null);
    try {
      // Convert data to NewUser type
      const userData: NewUser = {
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        birthDate: data.birthDate ? format(data.birthDate, 'yyyy-MM-dd') : undefined,
        gender: data.gender,
        phoneNumber: data.phoneNumber,
        website: data.website,
        companyName: data.companyName,
        activitySector: data.activitySector,
        position: data.position,
        language: data.language,
        theme: data.theme,
        password: data.password,
      };

      console.log('Submitting user data:', userData);
      await registerUser(userData);

      alert('Registration successful!');
    } catch (error: any) {
      console.error('Registration error:', error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Registration failed. Please try again.';
      setApiError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepTitle = () => {
    switch (step) {
      case 1:
        return <FormattedMessage id="personal-information" defaultMessage="Personal Information" />;
      case 2:
        return <FormattedMessage id="company-information" defaultMessage="Company Information" />;
      case 3:
        return <FormattedMessage id="customization" defaultMessage="Customization" />;
      case 4:
        return <FormattedMessage id="password-setup" defaultMessage="Password Setup" />;
      default:
        return <FormattedMessage id="sign-up" />;
    }
  };

  return (
    <div className="z-50 w-full space-y-4 rounded-lg p-8 text-[#0D2C60] shadow-md dark:text-[#EEF6FF] lg:bg-white lg:dark:bg-[#010E37]">
      <div className="flex items-center justify-between">
        <h1 className="text-start text-2xl font-semibold">{renderStepTitle()}</h1>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          <FormattedMessage
            id="step-of"
            defaultMessage="Step {current} of {total}"
            values={{ current: step, total: totalSteps }}
          />
        </div>
      </div>

      <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full">
        <div
          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${(step / totalSteps) * 100}%` }}
        ></div>
      </div>

      {apiError && (
        <div className="text-red-500 text-sm">{apiError}</div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
          {step === 1 && (
            <div className="space-y-3">
              {/* Email Field */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm">
                      <FormattedMessage id="email-address" />*
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="username@example.com"
                        {...field}
                        className="border-gray-200 dark:border-blue-950 focus:border-blue-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* First Name Field */}
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm">
                      <FormattedMessage id="first-name" />*
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={intl.formatMessage({
                          id: 'enter-your-first-name',
                          defaultMessage: 'Enter your first name',
                        })}
                        {...field}
                        className="border-gray-200 dark:border-blue-950 focus:border-blue-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Last Name Field */}
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm">
                      <FormattedMessage id="last-name" />*
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="border-gray-200 dark:border-blue-950 focus:border-blue-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Birth Date Field */}
              <FormField
                control={form.control}
                name="birthDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="text-sm">
                      <FormattedMessage id="birth-date" />
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              'w-full pl-3 text-left font-normal border-gray-200 dark:border-blue-950',
                              !field.value && 'text-muted-foreground',
                            )}
                          >
                            {field.value ? (
                              format(field.value, 'yyyy-MM-dd')
                            ) : (
                              <span>
                                <FormattedMessage id="pick-a-date" defaultMessage="Pick a date" />
                              </span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Gender Field */}
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm">
                      <FormattedMessage id="gender" />
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="border-gray-200 dark:border-blue-950">
                          <SelectValue
                            placeholder={intl.formatMessage({
                              id: 'select-gender',
                              defaultMessage: 'Select gender',
                            })}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="male">
                          <FormattedMessage id="male" defaultMessage="Male" />
                        </SelectItem>
                        <SelectItem value="female">
                          <FormattedMessage id="female" defaultMessage="Female" />
                        </SelectItem>
                        <SelectItem value="other">
                          <FormattedMessage id="other" defaultMessage="Other" />
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Phone Number Field */}
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm">
                      <FormattedMessage id="phone-number" />*
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="+1234567890"
                        {...field}
                        className="border-gray-200 dark:border-blue-950"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Website Field */}
              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm">
                      <FormattedMessage id="website" />*
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://example.com"
                        {...field}
                        className="border-gray-200 dark:border-blue-950"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

          {step === 2 && (
            <div className="space-y-3">
              {/* Company Name Field */}
              <FormField
                control={form.control}
                name="companyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm">
                      <FormattedMessage id="company-name" />*
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={intl.formatMessage({
                          id: 'enter-company-name',
                          defaultMessage: 'Enter company name',
                        })}
                        {...field}
                        className="border-gray-200 dark:border-blue-950"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Activity Sector Field */}
              <FormField
                control={form.control}
                name="activitySector"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm">
                      <FormattedMessage id="activity-sector" />*
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={intl.formatMessage({
                          id: 'enter-activity-sector',
                          defaultMessage: 'Enter activity sector',
                        })}
                        {...field}
                        className="border-gray-200 dark:border-blue-950"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Position Field */}
              <FormField
                control={form.control}
                name="position"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm">
                      <FormattedMessage id="position" />*
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={intl.formatMessage({
                          id: 'enter-position',
                          defaultMessage: 'Enter position',
                        })}
                        {...field}
                        className="border-gray-200 dark:border-blue-950"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

          {step === 3 && (
            <div className="space-y-3">
              {/* Language Field */}
              <FormField
                control={form.control}
                name="language"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm">
                      <FormattedMessage id="language" />
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="border-gray-200 dark:border-blue-950">
                          <SelectValue
                            placeholder={intl.formatMessage({
                              id: 'select-language',
                              defaultMessage: 'Select language',
                            })}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="en">
                          <FormattedMessage id="english" defaultMessage="English" />
                        </SelectItem>
                        <SelectItem value="fr">
                          <FormattedMessage id="french" defaultMessage="French" />
                        </SelectItem>
                        <SelectItem value="ar">
                          <FormattedMessage id="arabic" defaultMessage="Arabic" />
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Theme Color Field */}
              <FormField
                control={form.control}
                name="theme.color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm">
                      <FormattedMessage id="theme-color" />
                    </FormLabel>
                    <FormControl>
                      <ColorPicker color={field.value} onChange={field.onChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

          {step === 4 && (
            <div className="space-y-3">
              {/* Password Field */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm">
                      <FormattedMessage id="password" />*
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          {...field}
                          className="border-gray-200 dark:border-blue-950 pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 flex items-center pr-3"
                        >
                          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password Confirmation Field */}
              <FormField
                control={form.control}
                name="passwordConfirmation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm">
                      <FormattedMessage id="password-confirmation" />*
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          {...field}
                          className="border-gray-200 dark:border-blue-950 pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 flex items-center pr-3"
                        >
                          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

          <div className="flex justify-between mt-6">
            {step > 1 ? (
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                className="flex items-center gap-2"
                disabled={isSubmitting}
              >
                <ChevronLeft size={16} className={locale === 'ar' ? 'transform rotate-180' : ''} />
                <FormattedMessage id="previous" defaultMessage="Previous" />
              </Button>
            ) : (
              <div></div>
            )}

            {step < totalSteps ? (
              <Button
                type="button"
                onClick={nextStep}
                className="flex items-center gap-2"
                disabled={isSubmitting}
              >
                <FormattedMessage id="next" defaultMessage="Next" />
                <ChevronRight size={16} className={locale === 'ar' ? 'transform rotate-180' : ''} />
              </Button>
            ) : (
              <Button
                type="submit"
                className="flex items-center gap-2"
                disabled={isSubmitting}
              >
                <FormattedMessage id="sign-up" />
                {isSubmitting && (
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                )}
              </Button>
            )}
          </div>

          {step === 1 && (
            <>
              {/* Social Login Options */}
              <div className="mt-4">
                <div className="flex items-center justify-center space-x-4 mb-4">
                  <div className="h-px grow bg-gray-300"></div>
                  <span className="text-sm">
                    <FormattedMessage id="or-continue-with" />
                  </span>
                  <div className="h-px grow bg-gray-300"></div>
                </div>

                <div className="flex justify-center space-x-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex items-center gap-2 rounded-3xl border-gray-200 dark:border-blue-900 bg-neutral-100 dark:bg-navy px-4 py-2"
                  >
                    <GoogleIcon />
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="flex items-center gap-2 rounded-3xl border-gray-200 dark:border-blue-900 bg-neutral-100 dark:bg-navy px-4 py-2"
                  >
                    <FacebookIcon />
                  </Button>
                </div>
              </div>

              {/* Sign In Link */}
              <div className="flex justify-center space-x-1 text-sm mt-4">
                <span>
                  <FormattedMessage id="you-have-an-account" />
                </span>
                <Link href={`/${locale}/auth/login`} className="text-[#0F62FE] underline">
                  <FormattedMessage id="sign-in" />
                </Link>
              </div>
            </>
          )}
        </form>
      </Form>
    </div>
  );
};
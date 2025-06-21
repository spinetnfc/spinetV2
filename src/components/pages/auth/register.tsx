'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronLeft, ChevronRight, ChevronsRight, Eye, EyeOff, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FormattedMessage, useIntl } from 'react-intl';
import * as z from 'zod';
import { toast } from 'sonner';
import { format } from 'date-fns';
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
import { CalendarIcon } from 'lucide-react';
import FacebookIcon from '@/components/icons/facebook-icon';
import GoogleIcon from '@/components/icons/google-icon';
import AppleIcon from '@/components/icons/apple-icon';
import { cn } from '@/utils/cn';
import ColorPicker from '@/components/ui/color-picker';
import { registerUser, login as apiLogin } from '@/lib/api/auth';
import { addLinksAction } from '@/actions/links';
import { useAuth } from "@/context/authContext";
import type { User } from '@/types/user';

const LINK_TYPES = [
  "website", "linkedin", "instagram", "twitter", "github", "email", "phone",
  "facebook", "location", "order now", "play store", "app store", "whatsapp",
  "telegram", "viber", "other",
];

const registerSchema = z.object({
  email: z.string().email({ message: 'invalid-email-address' }),
  firstName: z.string().min(2, { message: 'firstname-required' }),
  password: z.string().min(8, { message: 'password-length' }),
  passwordConfirmation: z.string().min(8, { message: 'password-length' }),
  birthDate: z.date().optional(),
  gender: z.enum(['male', 'female', 'other']).optional(),
  companyName: z.string().min(3, { message: 'company-name-invalid' }).optional(),
  activitySector: z.string().min(3, { message: 'activity-sector-invalid' }).optional(),
  position: z.string().min(3, { message: 'position-invalid' }).optional(),
  language: z.enum(['en', 'fr', 'ar']).default('en'),
  theme: z.object({
    color: z.string().default('#0F62FE'),
  }).default({ color: '#0F62FE' }),
}).refine((data) => data.password === data.passwordConfirmation, {
  message: 'passwords-must-match',
  path: ['passwordConfirmation'],
});

type LinkType = {
  name: string;
  title: string;
  link: string;
};

export default function Register({ locale }: { locale: string }) {
  const intl = useIntl();
  const router = useRouter();
  const { login: authLogin, googleLogin, facebookLogin, appleLogin } = useAuth();
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [links, setLinks] = useState<LinkType[]>([]);
  const [newLink, setNewLink] = useState<LinkType>({ name: '', title: '', link: '' });
  const totalSteps = 5;

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      firstName: '',
      password: '',
      passwordConfirmation: '',
      birthDate: undefined,
      gender: undefined,
      companyName: ' ',
      activitySector: ' ',
      position: ' ',
      language: 'en',
      theme: { color: '#0F62FE' },
    },
  });

  const addLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLink.name || !newLink.title) {
      toast.error(intl.formatMessage({ id: 'Please fill in all required fields' }));
      return;
    }
    setLinks([...links, newLink]);
    setNewLink({ name: '', title: '', link: '' });
  };

  const removeLink = (index: number) => {
    setLinks(links.filter((_, i) => i !== index));
  };

  const nextStep = async () => {
    let fieldsToValidate: (keyof z.infer<typeof registerSchema>)[] = [];
    let hasRequiredFields = false;

    switch (step) {
      case 1:
        fieldsToValidate = ['email', 'password', 'passwordConfirmation'];
        hasRequiredFields = true;
        break;
      case 2:
        fieldsToValidate = ['firstName'];
        hasRequiredFields = true;
        break;
      case 3:
      case 4:
      case 5:
        // No required fields; bypass validation
        fieldsToValidate = [];
        hasRequiredFields = false;
        break;
    }

    if (hasRequiredFields && fieldsToValidate.length > 0) {
      const result = await form.trigger(fieldsToValidate);
      if (!result) return;
    }

    if (step < totalSteps) {
      setStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep((prev) => prev - 1);
    }
  };

  const skipStep = async () => {
    let fieldsToValidate: (keyof z.infer<typeof registerSchema>)[] = [];
    let hasRequiredFields = false;

    switch (step) {
      case 1:
        fieldsToValidate = ['email', 'password', 'passwordConfirmation'];
        hasRequiredFields = true;
        break;
      case 2:
        fieldsToValidate = ['firstName'];
        hasRequiredFields = true;
        break;
      case 3:
      case 4:
      case 5:
        // No required fields; bypass validation
        fieldsToValidate = [];
        hasRequiredFields = false;
        break;
    }

    if (hasRequiredFields && fieldsToValidate.length > 0) {
      const result = await form.trigger(fieldsToValidate);
      if (!result) return;
    }

    if (step < totalSteps) {
      setStep((prev) => prev + 1);
    } else {
      onSubmit(form.getValues());
    }
  };

  const onSubmit = async (data: z.infer<typeof registerSchema>) => {
    setIsSubmitting(true);
    try {
      const userData = {
        email: data.email,
        firstName: data.firstName,
        password: data.password,
        birthDate: data.birthDate ? format(data.birthDate, 'yyyy-MM-dd') : undefined,
        gender: data.gender || undefined,
        companyName: data.companyName,
        activitySector: data.activitySector,
        position: data.position,
        language: data.language,
        theme: data.theme,
      };

      const registerResponse = await registerUser(userData);
      if (!registerResponse.profile) {
        throw new Error('No profile ID returned');
      }

      const loginData = { email: data.email, password: data.password };
      const loginResponse = await apiLogin(loginData);

      // Construct user object matching User type
      const user: User = {
        _id: loginResponse._id || registerResponse.profile,
        email: data.email,
        firstName: data.firstName,
        lastName: loginResponse.lastName || '',
        fullName: loginResponse.fullName || data.firstName,
        birthDate: userData.birthDate || '',
        gender: userData.gender || '',
        companyName: data.companyName || '',
        activitySector: data.activitySector || '',
        position: data.position || '',
        phoneNumber: loginResponse.phoneNumber || '',
        website: loginResponse.website || '',
        language: data.language,
        theme: data.theme,
        Pro: loginResponse.Pro || { company: false, freeTrail: false },
        createdAt: loginResponse.createdAt || new Date().toISOString(),
        selectedProfile: registerResponse.profile,
        tokens: {
          fileApiToken: loginResponse.tokens?.fileApiToken || '',
          fileApiRefreshToken: loginResponse.tokens?.fileApiRefreshToken || '',
        },
      };

      // Set current-user cookie, mirroring AuthContext login
      document.cookie = `current-user=${encodeURIComponent(
        JSON.stringify(user)
      )}; path=/; SameSite=Lax; max-age=${60 * 60 * 24 * 7}`; // 7 days

      // Update AuthContext state
      authLogin(user);

      if (links.length > 0) {
        await addLinksAction(registerResponse.profile, links);
      }

      toast.success(intl.formatMessage({ id: 'Account registered successfully' }));
      setTimeout(() => {
        router.push(`/${locale}/app`);
      }, 2000);
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(intl.formatMessage({ id: 'Error: Failed to register or login' }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepTitle = () => {
    switch (step) {
      case 1:
        return <FormattedMessage id="sign-up" defaultMessage="Sign Up" />;
      case 2:
        return <FormattedMessage id="personal-information" defaultMessage="Personal Information" />;
      case 3:
        return <FormattedMessage id="professional-information" defaultMessage="Professional Information" />;
      case 4:
        return <FormattedMessage id="personal-links" defaultMessage="Personal Links" />;
      case 5:
        return <FormattedMessage id="customization" defaultMessage="Customization" />;
      default:
        return <FormattedMessage id="sign-up" />;
    }
  };

  return (
    <div className="z-50 w-full space-y-2 rounded-lg px-6 py-4 text-[#0D2C60] shadow-md dark:text-[#EEF6FF] lg:bg-white lg:dark:bg-[#010E37]">
      <div className="flex items-center  justify-between">
        <h1 className="text-start text-sm xs:text-base sm:text-2xl font-semibold">{renderStepTitle()}</h1>
        <div className="text-xs xs:text-sm text-gray-500 dark:text-gray-400 flex items-center">
          <FormattedMessage
            id="step-of"
            defaultMessage="Step {current} of {total}"
            values={{ current: step, total: totalSteps }}
          />
          <button
            type="button"
            // variant="ghost"
            onClick={skipStep}
            className="flex items-center ps-2 xs:ps-3 text-azure font-medium text-xs xs:text-sm"
            disabled={isSubmitting}
          >
            <FormattedMessage id="skip" defaultMessage="Skip" />
            <ChevronsRight strokeWidth={1.5} className={locale === 'ar' ? 'transform rotate-180' : ''} />
          </button>
        </div>
      </div>

      <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full">
        <div
          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${(step / totalSteps) * 100}%` }}
        ></div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
          {step === 1 && (
            <>
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
                        className="border-gray-200 dark:border-blue-950 focus:border-blue-500 h-9"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                          className="border-gray-200 dark:border-blue-950 pe-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 end-0 flex items-center pe-3"
                        >
                          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                          className="border-gray-200 dark:border-blue-950 pe-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 end-0 flex items-center pe-3"
                        >
                          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-between mt-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={skipStep}
                  className={`flex items-center gap-2 ${step === 1 ? 'hidden' : ''}`}
                  disabled={isSubmitting}
                >
                  <FormattedMessage id="skip" defaultMessage="Skip" />
                </Button>
                <Button
                  type="button"
                  onClick={nextStep}
                  className="flex items-center gap-2 ms-auto"
                  disabled={isSubmitting}
                >
                  <FormattedMessage id="next" defaultMessage="Next" />
                  <ChevronRight size={16} className={locale === 'ar' ? 'transform rotate-180' : ''} />
                </Button>
              </div>

              <div className="flex items-center justify-center gap-2">
                <div className="h-px grow bg-gray-300"></div>
                <span className="text-sm">
                  <FormattedMessage id="or-continue-with" />
                </span>
                <div className="h-px grow bg-gray-300"></div>
              </div>

              <div className="flex justify-center space-x-4">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => googleLogin()}
                  disabled={isSubmitting}
                  className="flex items-center gap-2 rounded-3xl border-gray-200 dark:border-blue-900 bg-neutral-100 dark:bg-navy px-4 py-2 transition-colors duration-300 hover:bg-gray-200 dark:hover:bg-navy/80"
                >
                  <GoogleIcon />
                </Button>
                <Button
                  variant="outline"
                  className="flex items-center gap-2 rounded-3xl border-gray-200 dark:border-blue-900 bg-neutral-100 dark:bg-navy px-4 py-2 transition-colors duration-300 hover:bg-gray-200 dark:hover:bg-navy/80"
                  onClick={() => facebookLogin()}
                  disabled={isSubmitting}
                >
                  <FacebookIcon />
                </Button>
                <Button
                  variant="outline"
                  className="flex items-center gap-2 rounded-3xl border-gray-200 dark:border-blue-900 bg-neutral-100 dark:bg-navy px-4 py-2 transition-colors duration-300 hover:bg-gray-200 dark:hover:bg-navy/80"
                  onClick={() => appleLogin()}
                  disabled={isSubmitting}
                >
                  <AppleIcon />
                </Button>
              </div>

              <div className="flex justify-center space-x-1 text-sm mt-2">
                <span>
                  <FormattedMessage id="you-have-an-account" />
                </span>
                <Link href={`/${locale}/auth/login`} className="text-[#0F62FE] underline">
                  <FormattedMessage id="sign-in" />
                </Link>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm">
                      <FormattedMessage id="full-name" />*
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={intl.formatMessage({
                          id: 'enter-your-full-name',
                          defaultMessage: 'Enter your full name',
                        })}
                        {...field}
                        className="border-gray-200 dark:border-blue-950 focus:border-blue-500 h-9"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                              'w-full ps-3 text-left font-normal border-gray-200 dark:border-blue-950 text-gray-400 dark:text-blue-800',
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
                            <CalendarIcon className="ms-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          restrictFutureDates={true}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                        <SelectTrigger className="border-gray-200 dark:border-blue-950 font-regular">
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

              <div className="flex justify-between mt-3">
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

                <Button
                  type="button"
                  onClick={nextStep}
                  className="flex items-center gap-2"
                  disabled={isSubmitting}
                >
                  <FormattedMessage id="next" defaultMessage="Next" />
                  <ChevronRight size={16} className={locale === 'ar' ? 'transform rotate-180' : ''} />
                </Button>
              </div>
            </>
          )}

          {step === 3 && (
            <>
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

              <div className="flex justify-between mt-3">
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

                <Button
                  type="button"
                  onClick={nextStep}
                  className="flex items-center gap-2"
                  disabled={isSubmitting}
                >
                  <FormattedMessage id="next" defaultMessage="Next" />
                  <ChevronRight size={16} className={locale === 'ar' ? 'transform rotate-180' : ''} />
                </Button>
              </div>
            </>
          )}

          {step === 4 && (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">
                  <FormattedMessage id="personal-links" defaultMessage="Personal Links" />
                </h2>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <span><FormattedMessage id="link-type" /></span>
                  <Select value={newLink.name} onValueChange={(value) => setNewLink({ ...newLink, name: value })}>
                    <SelectTrigger id="linkType">
                      <SelectValue placeholder={intl.formatMessage({ id: "select-link-type", defaultMessage: "Select link type" })} />
                    </SelectTrigger>
                    <SelectContent>
                      {LINK_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <span ><FormattedMessage id="display-text" /></span>
                  <Input
                    id="linkTitle"
                    value={newLink.title}
                    onChange={(e) => setNewLink({ ...newLink, title: e.target.value })}
                    placeholder={intl.formatMessage({ id: "e.g. My Website, @username", defaultMessage: "e.g. My Website" })}
                  />
                </div>

                {newLink.name !== "email" && newLink.name !== "phone" && (
                  <div className="space-y-2">
                    <span ><FormattedMessage id="url" /></span>
                    <Input
                      id="linkUrl"
                      value={newLink.link || ""}
                      onChange={(e) => setNewLink({ ...newLink, link: e.target.value })}
                      placeholder="https://"
                      type="url"
                    />
                  </div>
                )}

                <Button type="button" onClick={addLink} className="w-full">
                  <FormattedMessage id="add-link" defaultMessage="Add Link" />
                </Button>
              </div>

              {links.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-lg font-semibold"><FormattedMessage id="added-links" defaultMessage="Added Links" /></h3>
                  <ul className="space-y-2 mt-2">
                    {links.map((link, index) => (
                      <li key={index} className="flex justify-between items-center border p-2 rounded">
                        <span>{link.title} ({link.name})</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeLink(index)}
                        >
                          <X size={16} />
                        </Button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex justify-between mt-3">
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

                <Button
                  type="button"
                  onClick={nextStep}
                  className="flex items-center gap-2"
                  disabled={isSubmitting}
                >
                  <FormattedMessage id="next" defaultMessage="Next" />
                  <ChevronRight size={16} className={locale === 'ar' ? 'transform rotate-180' : ''} />
                </Button>
              </div>
            </div>
          )}

          {step === 5 && (
            <>
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

              <FormField
                control={form.control}
                name="theme.color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm me-4">
                      <FormattedMessage id="theme-color" />
                    </FormLabel>
                    <FormControl>
                      <ColorPicker color={field.value} onChange={field.onChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-between mt-3">
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

                <Button
                  type="button"
                  //skip validation since last step has no required fields
                  onClick={() => onSubmit(form.getValues())}
                  className="flex items-center gap-2"
                  disabled={isSubmitting}
                >
                  <FormattedMessage id="finish" defaultMessage="Finish" />
                  {isSubmitting && (
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  )}
                </Button>
              </div>
            </>
          )}
        </form>
      </Form>
    </div>
  );
}
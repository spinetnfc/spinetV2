'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FormattedMessage, IntlProvider, useIntl } from 'react-intl';
import * as z from 'zod';
import type { NewUser } from '@/types/auth';
import { registerUser } from '@/lib/api/auth';
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
import { toast } from "sonner";

const registerSchema = z.object({
  email: z.string().email({ message: 'invalid-email-address' }),
  firstName: z.string().min(2, { message: 'firstname-required' }),
  password: z.string().min(8, { message: 'password-length' }),
  passwordConfirmation: z.string().min(8, { message: 'password-length' }),
}).refine((data) => data.password === data.passwordConfirmation, {
  message: 'passwords-must-match',
  path: ['passwordConfirmation'],
});

// export default function Register({ locale, messages }: { locale: string; messages: Record<string, string> }) {
//   return (
//     <IntlProvider locale={locale} messages={messages}>
//       <RegisterForm locale={locale} />
//     </IntlProvider>
//   );
// }

export default function Register({ locale }: { locale: string }) {
  const intl = useIntl();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      firstName: '',
      password: '',
      passwordConfirmation: '',
    },
  });

  const onSubmit = async (data: z.infer<typeof registerSchema>) => {
    setIsSubmitting(true);
    try {
      const userData: NewUser = {
        email: data.email,
        firstName: data.firstName,
        password: data.password,
      };

      console.log('Submitting user data:', userData);
      const response = await registerUser(userData);

      console.log('Registration response:', response);
      toast.success(intl.formatMessage({ id: "Account registered successfully, Proceeding to onboarding..." }));

      setTimeout(() => {
        router.push(`/${locale}/auth/onboarding`);
      }, 2000);
    } catch (error: any) {
      console.error('Registration error:', error);
      toast.error(intl.formatMessage({ id: "Error: Failed to register" }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="z-50 w-full space-y-2 rounded-lg px-6 py-4 text-[#0D2C60] shadow-md dark:text-[#EEF6FF] lg:bg-white lg:dark:bg-[#010E37]">
      <h1 className="text-start text-2xl font-semibold">
        <FormattedMessage id="sign-up" defaultMessage="Sign Up" />
      </h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
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

          <Button
            type="submit"
            className="w-full flex items-center gap-2"
            disabled={isSubmitting}
          >
            <FormattedMessage id="sign-up" />
            {isSubmitting && (
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
            )}
          </Button>

          <div className="flex justify-center space-x-1 text-sm mt-2">
            <span>
              <FormattedMessage id="you-have-an-account" />
            </span>
            <Link href={`/${locale}/auth/login`} className="text-[#0F62FE] underline">
              <FormattedMessage id="sign-in" />
            </Link>
          </div>
        </form>
      </Form>
    </div>
  );
};
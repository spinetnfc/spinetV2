'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useIntl, FormattedMessage, IntlProvider } from 'react-intl';
import * as z from 'zod';
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
import { login } from '@/lib/api/auth';
import { toast } from 'sonner';
import { useAuth } from '@/context/authContext'; // Import useAuth

// Zod validation schema
const loginSchema = z.object({
  email: z.string().email({ message: 'invalid-email-address' }),
  password: z.string().min(8, { message: 'password-length' }),
});

type Props = {
  locale: string;
  messages: Record<string, string>;
};

export default function Login({ locale, messages }: Props) {
  return (
    <IntlProvider locale={locale} messages={messages}>
      <LoginForm locale={locale} />
    </IntlProvider>
  );
}

const LoginForm = ({ locale }: { locale: string }) => {
  const intl = useIntl();
  const [showPassword, setShowPassword] = useState(false);
  const { login: authLogin } = useAuth(); // Get login function from AuthContext

  // Initialize form with zod resolver
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // Handle form submission
  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    try {
      const response = await login(data);
      const user = response;
      if (!user || typeof user !== 'object') {
        throw new Error('Invalid user response');
      }

      // Save user to cookie — must stringify safely
      document.cookie = `current-user=${encodeURIComponent(JSON.stringify(user))}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
      document.cookie = `fileApiToken=${encodeURIComponent(JSON.stringify((user.tokens.fileApiToken)))}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
      document.cookie = `fileApiRefreshToken=${encodeURIComponent(JSON.stringify(user.tokens.fileApiRefreshToken))}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;

      authLogin(user); // Call AuthContext login function
      toast.success('Login successful');
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed');
    }
  };


  return (
    <div className="z-50 w-full space-y-6 rounded-lg p-8 text-[#0D2C60] shadow-md dark:text-[#EEF6FF] lg:bg-white lg:dark:bg-[#010E37]">
      {/* Login Title */}
      <h1 className="text-start text-4xl font-semibold ">
        <FormattedMessage id="login" />
      </h1>

      {/* Login Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Email Field */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm ">
                  <FormattedMessage id="email-address" />
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="username@gmail.com"
                    {...field}
                    className="border-gray-200 dark:border-blue-950 focus:border-blue-500"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password Field */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm ">
                  <FormattedMessage id="password" />
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder={intl.formatMessage({
                        id: 'password',
                      })}
                      {...field}
                      className="border-gray-200 dark:border-blue-950 pr-10  focus:border-blue-500"
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

          {/* Forgot Password Link */}
          <div className="flex justify-end">
            <Link
              href={`/${locale}/auth/forgot-password`}
              className="text-sm text-azure hover:underline"
            >
              <FormattedMessage id="forgot-password" />
            </Link>
          </div>

          {/* Sign In Button */}
          <Button
            type="submit"
            className="w-full"
          >
            <FormattedMessage id="sign-in" />
          </Button>

          {/* Divider */}
          <div className="flex items-center justify-center gap-2">
            <div className="h-px grow bg-gray-300"></div>
            <span className="text-sm ">
              <FormattedMessage id="or-continue-with" />
            </span>
            <div className="h-px grow bg-gray-300"></div>
          </div>

          {/* Social Login Options */}
          <div className="flex justify-center space-x-4">
            <Button
              variant="outline"
              className="flex items-center gap-2 rounded-3xl border-gray-200 dark:border-blue-900 bg-neutral-100 dark:bg-navy px-4 py-2 transition-colors duration-300 hover:bg-gray-200 dark:hover:bg-navy/80"
            >
              <GoogleIcon />
            </Button>
            <Button
              variant="outline"
              className="flex items-center gap-2 rounded-3xl border-gray-200 dark:border-blue-900 bg-neutral-100 dark:bg-navy px-4 py-2 transition-colors duration-300 hover:bg-gray-200 dark:hover:bg-navy/80"
            >
              <FacebookIcon />
            </Button>
          </div>

          {/* Sign Up Link */}
          <div className="flex justify-center space-x-1 text-sm">
            <span className="">
              <FormattedMessage id="dont-have-an-account-yet" />
            </span>
            <Link
              href={`/${locale}/auth/register`}
              className="text-[#0F62FE] hover:underline"
            >
              <FormattedMessage id="register-for-free" />
            </Link>
          </div>
        </form>
      </Form>
    </div>
  );
};
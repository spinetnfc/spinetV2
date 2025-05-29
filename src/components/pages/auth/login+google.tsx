'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Divide, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useIntl, FormattedMessage, IntlProvider } from 'react-intl';
import * as z from 'zod';
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
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
import { useAuth } from '@/context/authContext';

const loginSchema = z.object({
    email: z.string().email({ message: 'invalid-email-address' }),
    password: z.string().min(8, { message: 'password-length' }),
});

type Props = {
    locale: string;
    messages: Record<string, string>;
};

interface User {
    _id: string;
    email: string;
    fullName: string;
    firstName: string;
    lastName: string;
    birthDate: string;
    gender: string;
    companyName: string;
    activitySector: string;
    position: string;
    phoneNumber: string;
    website: string;
    language: string;
    theme: { color: string };
    Pro: { company: boolean; freeTrail: boolean };
    createdAt: string;
    selectedProfile: string;
    tokens: {
        fileApiToken: string;
        fileApiRefreshToken: string;
    };
    token?: string; // Main API token
    refreshToken?: string; // Main API refresh token
}

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
    const { login: authLogin } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const form = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const onSubmit = async (data: z.infer<typeof loginSchema>) => {
        try {
            setIsSubmitting(true);
            const response = await login(data);
            const user: User = {
                ...response,
                tokens: response.tokens || { fileApiToken: '', fileApiRefreshToken: '' }, // Ensure tokens is defined
            };
            if (!user || typeof user !== 'object') {
                throw new Error('Invalid user response');
            }
            if (user.token) {
                document.cookie = `mainApiToken = ${encodeURIComponent(user.token)}; path =/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
            }
            authLogin(user);
            toast.success(intl.formatMessage({ id: 'login successful' }));
        } catch (error) {
            console.error('Login error:', error);
            toast.error(intl.formatMessage({ id: 'login failed' }));
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleGoogleLogin = useGoogleLogin({
        scope: 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email',
        onSuccess: async (tokenResponse) => {
            try {
                setIsSubmitting(true);
                const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                    headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
                });
                if (!response.ok) throw new Error(`Google API error: ${response.statusText}`);
                const googleUser = await response.json();

                const userData = {
                    googleId: googleUser.sub,
                    email: googleUser.email || 'unknown@example.com',
                    firstName: googleUser.given_name || 'alpha',
                    lastName: googleUser.family_name || 'sigma',
                };

                const res = await fetch('https://api.spinet.app/auth/signup', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(userData),
                });
                if (!res.ok) {
                    console.error('Backend response:', await res.text());
                    throw new Error(`Backend error: ${res.statusText}`);
                }
                const data = await res.json();
                console.log('Full signup response:', data); // Log to check tokens

                const user: User = {
                    ...data,
                    tokens: data.tokens || { fileApiToken: '', fileApiRefreshToken: '' }, // Ensure tokens is defined
                };

                if (user.token) {
                    document.cookie = `mainApiToken=${encodeURIComponent(user.token)}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
                } else {
                    console.warn('No main API token found in response');
                }

                authLogin(user);
                toast.success(intl.formatMessage({ id: 'login successful' }));
            } catch (error) {
                console.error('Google login error:', error);
                toast.error(intl.formatMessage({ id: 'login failed' }));
            } finally {
                setIsSubmitting(false);
            }
        },
        onError: (error) => {
            console.error('Google login error:', error);
            toast.error(intl.formatMessage({ id: 'login failed' }));
            setIsSubmitting(false);
        },
    });

    const handleLogout = () => {
        googleLogout();
        document.cookie = `mainApiToken=; path=/; max-age=0; SameSite=Lax`;
        // authLogin(null);
    };

    return (
        <div className="z-50 w-full space-y-6 rounded-lg p-8 text-[#0D2C60] shadow-md dark:text-[#EEF6FF] lg:bg-white lg:dark:bg-[#010E37]">
            <h1 className="text-start text-4xl font-semibold">
                <FormattedMessage id="login" />
            </h1>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-sm">
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

                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-sm">
                                    <FormattedMessage id="password" />
                                </FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Input
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder={intl.formatMessage({ id: 'password' })}
                                            {...field}
                                            className="border-gray-200 dark:border-blue-950 pr-10 focus:border-blue-500"
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

                    <div className="flex justify-end">
                        <Link
                            href={`/${locale}/auth/forgot-password`}
                            className="text-sm text-azure hover:underline"
                        >
                            <FormattedMessage id="forgot-password" />
                        </Link>
                    </div>

                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                <FormattedMessage id="signing-in" />
                            </>
                        ) : (
                            <FormattedMessage id="sign-in" />
                        )}
                    </Button>

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
                            onClick={() => handleGoogleLogin()}
                            disabled={isSubmitting}
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

                    <div className="flex justify-center space-x-1 text-sm">
                        <span>
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
``
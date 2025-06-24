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
import AppleIcon from '@/components/icons/apple-icon';
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
import { useFacebookSDK } from '@/hooks/use-facebookDSK';
import Script from 'next/script';


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
    Pro: { company: boolean; freeTrial: boolean };
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
    const { login: authLogin, googleLogin, facebookLogin, appleLogin } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);
    useFacebookSDK(process.env.NEXT_PUBLIC_FACEBOOK_APP_ID ?? '');

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

    return (
        <div className="z-50 w-full space-y-6 rounded-lg p-8 text-[#0D2C60] lg:shadow-md dark:text-[#EEF6FF] lg:bg-white lg:dark:bg-[#010E37]">
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
                                            className="border-gray-200 dark:border-blue-950 pe-10 focus:border-blue-500"
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
            <Script
                src="https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js"
                strategy="afterInteractive"
                onLoad={() => {
                    if ((window as any).AppleID) {
                        (window as any).AppleID.auth.init({
                            clientId: "com.example.web",
                            scope: "name email",
                            redirectURI: "https://yourdomain.com/auth/callback",
                            usePopup: true,
                        });
                    }
                }}
            />
        </div>
    );
};
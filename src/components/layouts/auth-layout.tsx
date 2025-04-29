'use client';

import Image from 'next/image';
import { useRouter, usePathname, useParams } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import AuthenticationImage from '@/components/icons/authentication-image';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/utils/cn';
import ThemeSwitch from '../theme-switch';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { useAuth } from '@/context/authContext';

type LayoutProps = {
  children: ReactNode;
};

export const AuthLayout = ({ children }: LayoutProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { isAuthenticated } = useAuth();

  // Ensure component is mounted before using window properties
  useEffect(() => {
    setMounted(true);
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();

    // Add resize listener
    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Handle redirection for authenticated users
  useEffect(() => {
    if (mounted && isAuthenticated && pathname !== '/auth/forgot-password') {
      const localeParam = params.locale;
      const locale =
        typeof localeParam === 'string'
          ? localeParam
          : Array.isArray(localeParam)
            ? localeParam[0]
            : 'en';
      router.push(`/${locale}`);
    }
  }, [mounted, isAuthenticated, pathname, router, params.locale]);

  const localeParam = params.locale;
  const locale =
    typeof localeParam === 'string'
      ? localeParam
      : Array.isArray(localeParam)
        ? localeParam[0]
        : 'en';

  // Render a simple loading state during server-side rendering
  // to avoid hydration mismatches
  if (!mounted) {
    return (
      <div className="relative flex w-full flex-col items-center justify-center min-h-screen">
        <Spinner size="xxl" />
      </div>
    );
  }

  // Show loading spinner while redirecting
  if (isAuthenticated && pathname !== '/auth/forgot-password') {
    return (
      <div className="relative flex w-full flex-col items-center justify-center min-h-screen">
        <Spinner size="xxl" />
      </div>
    );
  }

  return (
    <ErrorBoundary fallback={<div>Something went wrong!</div>}>
      <div className="relative flex w-full flex-col items-center justify-center sm:h-dvh md:h-screen md:max-h-screen">
        <div className="absolute end-2 top-2 z-10">
          <div className="flex px-4 w-screen items-center justify-between">
            <Link href="/" className="cursor-pointer">
              <Image
                src={
                  resolvedTheme === 'light' && isMobile
                    ? '/img/logo-spinet.svg'
                    : '/img/logo-spinet-dark.svg'
                }
                alt="logo"
                width={160}
                height={40}
              />
            </Link>
            <ThemeSwitch locale={locale} />
          </div>
        </div>
        <Image
          src="/img/abstract.jpeg"
          alt="auth Background"
          fill
          sizes="100vw"
          className={`absolute inset-0 z-0 hidden object-cover lg:block ${locale === 'ar' ? 'transform scale-x-[-1]' : ''
            }`}
          priority
        />
        <div className="flex size-full flex-col-reverse items-center justify-center rounded-md pt-12 lg:mx-48 lg:my-52 lg:flex-row lg:gap-20 lg:px-32 lg:py-20">
          {children}
          <div className="z-10 lg:w-1/2">
            {pathname !== '/auth/forgot-password' ? (
              <img
                src="/img/authentication.png"
                alt="auth illustration"
                className="w-60 xs:w-80"
              />
            ) : (
              <AuthenticationImage
                className={cn('text-white', {
                  'text-navy dark:text-white lg:text-white':
                    pathname === '/auth/forgot-password',
                })}
              />
            )}
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

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
import logoSpinet from '@/assets/images/logo-spinet.svg';
import logoSpinetDark from '@/assets/images/logo-spinet-dark.svg';
import authImage from '@/assets/images/authentication.png';
import authBg from '@/assets/images/abstract.jpeg';
import { getLocale } from '@/utils/getClientLocale';
import ChangeLanguage from '../change-language';

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
    if (mounted && isAuthenticated && !pathname?.includes('/auth/forgot-password')) {
      const locale = getLocale() || 'en';

      router.push(`/${locale}/app`);
    }
  }, [mounted, isAuthenticated, pathname, router, params.locale]);

  const locale = getLocale() || 'en';

  // Render a simple loading state during server-side rendering to avoid hydration mismatches
  if (!mounted) {
    return (
      <div className="relative flex w-full flex-col items-center justify-center min-h-screen">
        <Spinner size="xxl" />
      </div>
    );
  }

  // Show loading spinner while redirecting
  if (isAuthenticated && !pathname?.includes('/auth/forgot-password')) {
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
          <div className="flex ps-4 w-screen items-center justify-between">
            <Link href="/" className="cursor-pointer">
              <Image
                src={
                  resolvedTheme === 'light' && isMobile
                    ? logoSpinet
                    : logoSpinetDark
                }
                alt="logo"
                width={160}
                height={40}
              />
            </Link>
            <div className="flex items-center gap-2">
              <ChangeLanguage locale={locale} />
              <ThemeSwitch locale={locale} />
            </div>
          </div>
        </div>
        <Image
          src={authBg}
          quality={100}
          alt="auth Background"
          fill
          sizes="100vw"
          className={`absolute inset-0 z-0 hidden object-cover lg:block ${locale === 'ar' ? 'transform scale-x-[-1]' : ''
            }`}
          priority
        />
        <div className="flex size-full flex-col-reverse items-center justify-center rounded-md pt-12 lg:mx-48 lg:my-52 lg:flex-row lg:gap-10 lg:px-10 xl:px-20 2xl:px-32 xl:gap-20  lg:py-20">
          {children}
          <div className="z-10 lg:w-1/2">
            {!pathname?.includes('/auth/forgot-password') ? (
              <Image
                priority
                src={authImage}
                alt="auth illustration"
                className="w-60 xs:w-80 lg:w-full"
              />
            ) : (
              <AuthenticationImage
                className={cn('text-white', {
                  'text-navy dark:text-white lg:text-white':
                    pathname?.includes('/auth/forgot-password'),
                })}
              />
            )}
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

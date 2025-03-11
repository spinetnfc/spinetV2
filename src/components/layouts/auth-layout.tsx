'use client';

import Image from 'next/image';
import { useRouter, usePathname, useParams } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import AuthenticationImage from '@/components/icons/authentication-image';
import { Spinner } from '@/components/ui/spinner';
import { useUser } from '@/lib/auth';
import { cn } from '@/utils/cn';
import ThemeSwitch from '../theme-switch';
import { useTheme } from 'next-themes';
import Link from 'next/link';

type LayoutProps = {
  children: ReactNode;
};

export const AuthLayout = ({ children }: LayoutProps) => {
  const user = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (user.data) {
      router.replace('/app');
    }
  }, [user.data, router]);

  // Ensure component is mounted before using window properties
  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      setIsMobile(window.innerWidth < 1024);
    }
  }, []);

  const localeParam = params.locale;
  const locale =
    typeof localeParam === 'string'
      ? localeParam
      : Array.isArray(localeParam)
        ? localeParam[0]
        : 'en';

  return (
    <ErrorBoundary key={pathname} fallback={<div>Something went wrong!</div>}>
      <div className="relative flex w-full flex-col items-center justify-center sm:h-dvh md:h-screen md:max-h-screen">
        <div className="absolute end-2 top-2 z-10">
          <div className="flex px-4 w-screen items-center justify-between">
            <Link href="/" className="cursor-pointer">
              {mounted ? (
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
              ) : (
                <div className="w-40 h-10 bg-gray-200 animate-pulse" />
              )}
            </Link>
            <ThemeSwitch />
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

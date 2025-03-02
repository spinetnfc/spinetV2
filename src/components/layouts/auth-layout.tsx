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

  useEffect(() => {
    if (user.data) {
      router.replace('/app');
    }
  }, [user.data, router]);

  // Ensure component is mounted before using theme
  useEffect(() => {
    setMounted(true);
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
          <ThemeSwitch parentDarkMode locale={locale} />
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
              mounted ? (
                <img
                  src={
                    resolvedTheme === "light"
                      ? "/img/authentication-light.png"
                      : "/img/authentication.png"
                  }
                  alt="auth illustration"
                  className="w-60 xs:w-80"
                />
              ) : (
                <div className="w-60 xs:w-80 h-48 bg-gray-200 animate-pulse" />
              )
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

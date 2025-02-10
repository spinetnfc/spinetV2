'use client';

import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { ReactNode, useEffect, Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

// import { Link } from '@/components/ui/link';
import AuthenticationImage from '@/components/icons/authentication-image';
import { Spinner } from '@/components/ui/spinner';
import { useUser } from '@/lib/auth';
import { cn } from '@/utils/cn';

import SpinetLogo from '../icons/spinet-logo-1';
import ThemeSwitch from '../theme-switch';

type LayoutProps = {
  children: ReactNode;
};

export const AuthLayout = ({ children }: LayoutProps) => {
  const user = useUser();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (user.data) {
      router.replace('/app');
    }
  }, [user.data, router]);

  return (
    <Suspense
      fallback={
        <div className="flex size-full items-center justify-center">
          <Spinner size="xl" />
        </div>
      }
    >
      <ErrorBoundary key={pathname} fallback={<div>Something went wrong!</div>}>
        <div className="relative flex w-full flex-col items-center justify-center sm:h-dvh  md:h-screen md:max-h-screen   ">
          <div className="absolute end-2 top-2 z-10">
            <ThemeSwitch parentDarkMode />
          </div>
          <Image
            src="/img/abstract.jpeg"
            alt="auth Background"
            fill
            sizes="100vw"
            className="absolute inset-0 z-0 hidden object-cover lg:block"
            priority
          />
          <div className="flex size-full flex-col-reverse items-center justify-center gap-9 rounded-md  lg:mx-48 lg:my-52 lg:flex-row lg:gap-20 lg:px-32 lg:py-20">
            {children}

            <div
              className={cn('z-10 hidden lg:w-1/2 lg:block', {
                'block ': pathname === '/auth/forgot-password',
              })}
            >
              {pathname !== '/auth/forgot-password' ? (
                <img src="/img/authentication.png" alt="auth illustration" />
              ) : (
                <AuthenticationImage
                  className={cn('text-white', {
                    'text-[#082356] dark:text-white lg:text-white':
                      pathname === '/auth/forgot-password',
                  })}
                />
              )}
            </div>
            <SpinetLogo
              className={
                pathname === '/auth/forgot-password' ? 'hidden' : 'block'
              }
            />
          </div>
        </div>
      </ErrorBoundary>
    </Suspense>
  );
};

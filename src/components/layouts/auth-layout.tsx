'use client';

import Link from 'next/link';
import { ReactNode } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import ThemeSwitch from '../theme-switch';
import { useLocale } from '@/hooks/use-locale';
import ChangeLanguage from '../change-language';
import { ChevronLeft } from 'lucide-react';
import SpinetLogo from '../icons/spinet-logo';

type LayoutProps = {
   children: ReactNode;
};

export const AuthLayout = ({ children }: LayoutProps) => {
   const locale = useLocale();

   return (
      <ErrorBoundary
         fallback={
            <div className="flex h-screen w-full items-center justify-center">
               <div className="text-center">
                  <h1 className="text-2xl font-bold text-destructive">
                     Something went wrong
                  </h1>
                  <p className="mt-2 text-muted-foreground">
                     Please refresh the page and try again.
                  </p>
               </div>
            </div>
         }
      >
         <div className="h-screen bg-gradient-to-br from-background to-muted/20 flex flex-col">
            {/* Header */}
            <header className="flex items-center justify-between p-6 flex-shrink-0">
               {/* Logo and Back Button */}
               <Link
                  href={`/${locale}`}
                  className="flex items-center gap-3 text-foreground hover:text-muted-foreground transition-colors"
               >
                  <ChevronLeft className="h-5 w-5" />
                  <SpinetLogo className="hover:cursor-pointer w-28 md:w-40" width={151} height={31} />
               </Link>

               {/* Theme and Language Switchers */}
               <div className="flex items-center gap-3">
                  <ChangeLanguage locale={locale} />
                  <ThemeSwitch locale={locale} />
               </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex items-center justify-center px-3 sm:px-3 pb-6">
               <div className="w-full max-w-md lg:max-w-lg xl:max-w-xl">
                  <div className="rounded-lg border bg-card p-4 sm:p-8 shadow-lg">
                     {children}
                  </div>
               </div>
            </main>
         </div>
      </ErrorBoundary>
   );
};

export default AuthLayout;

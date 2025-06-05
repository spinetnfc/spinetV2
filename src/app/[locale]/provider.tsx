'use client';

import { ThemeProvider } from 'next-themes';
import * as React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { MainErrorFallback } from '@/components/errors/main';
import { Notifications } from '@/components/ui/notifications';
import { AuthProvider } from '@/context/authContext';
import { Toaster } from '@/components/ui/sonner';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { usePathname } from 'next/navigation';
import { IntlProvider } from 'react-intl';
import enMessages from '@/lang/en.json';
import arMessages from '@/lang/ar.json';
import frMessages from '@/lang/fr.json';

const messagesMap = {
  en: enMessages,
  ar: arMessages,
  fr: frMessages,
};

type AppProviderProps = {
  children: React.ReactNode;
};

export const AppProvider = ({ children }: AppProviderProps) => {
  const pathname = usePathname();
  const pathLocale = pathname ? pathname.split('/')[1] : undefined;
  const locale = pathLocale === "ar" || pathLocale === "fr" ? pathLocale : "en";
  const messages = messagesMap[locale as keyof typeof messagesMap];

  return (
    <ErrorBoundary FallbackComponent={MainErrorFallback}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <IntlProvider locale={locale} messages={messages} defaultLocale="en">
          <GoogleOAuthProvider clientId="191856451903-98inavnv0kljgjt7hcda44do034ou8ua.apps.googleusercontent.com">
            <AuthProvider>
              <Toaster position="bottom-right" />
              <Notifications />
              {children}
            </AuthProvider>
          </GoogleOAuthProvider>
        </IntlProvider>
      </ThemeProvider>
    </ErrorBoundary >
  );
};

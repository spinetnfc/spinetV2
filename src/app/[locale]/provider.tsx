'use client';

import { ThemeProvider } from 'next-themes';
import * as React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { MainErrorFallback } from '@/components/errors/main';
import { Notifications } from '@/components/ui/notifications';
import { AuthProvider } from '@/context/authContext';
import { Toaster } from '@/components/ui/sonner';
import { GoogleOAuthProvider } from '@react-oauth/google';

type AppProviderProps = {
  children: React.ReactNode;
};

export const AppProvider = ({ children }: AppProviderProps) => {


  return (
    <ErrorBoundary FallbackComponent={MainErrorFallback}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <GoogleOAuthProvider clientId="191856451903-98inavnv0kljgjt7hcda44do034ou8ua.apps.googleusercontent.com">
          <AuthProvider>
            <Toaster position="bottom-right" />
            <Notifications />
            {children}
          </AuthProvider>
        </GoogleOAuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

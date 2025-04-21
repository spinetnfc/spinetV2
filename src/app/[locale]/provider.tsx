'use client';

import { ThemeProvider } from 'next-themes';
import * as React from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { MainErrorFallback } from '@/components/errors/main';
import { Notifications } from '@/components/ui/notifications';
import { AuthProvider } from '@/context/authContext';
type AppProviderProps = {
  children: React.ReactNode;
};

export const AppProvider = ({ children }: AppProviderProps) => {


  return (
    <ErrorBoundary FallbackComponent={MainErrorFallback}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <AuthProvider>
          <Notifications />
          {children}
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

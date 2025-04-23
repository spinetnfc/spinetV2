'use client';

import { useTheme } from 'next-themes';
import { Toaster as Sonner, ToasterProps } from 'sonner';
import { useEffect, useState } from 'react';

const Toaster = ({ ...props }: ToasterProps) => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Ensure theme is only applied after client-side mount to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Define theme-specific colors
  const lightThemeStyles = {
    '--normal-bg': 'white',
    '--normal-text': '#010E37',
    '--normal-border': '#e0e0e0',
    '--success-bg': 'white',
    '--success-text': '#155724',
    '--success-border': '#c3e6cb',
    '--error-bg': 'white',
    '--error-text': '#7f1d1d',
    '--error-border': '#7f1d1d',
  } as React.CSSProperties;

  const darkThemeStyles = {
    '--normal-bg': 'var(--background)',
    '--normal-text': '#e0e0e0',
    '--normal-border': '#333333',
    '--success-bg': 'var(--background)',
    '--success-text': '#d4edda',
    '--success-border': '#40916c',
    '--error-bg': 'var(--background)',
    '--error-text': '#7f1d1d',
    '--error-border': '#7f1d1d',
  } as React.CSSProperties;

  return (
    <Sonner
      theme={resolvedTheme as ToasterProps['theme']}
      className="toaster group"
      style={resolvedTheme === 'dark' ? darkThemeStyles : lightThemeStyles}
      richColors
      position="bottom-right"
      {...props}
    />
  );
};

export { Toaster };
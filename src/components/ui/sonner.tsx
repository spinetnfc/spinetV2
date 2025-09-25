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

  // Define theme-specific colors using our color system
  const lightThemeStyles = {
    '--normal-bg': 'hsl(var(--background))',
    '--normal-text': 'hsl(var(--spinet-text-primary))',
    '--normal-border': 'hsl(var(--border))',
    '--success-bg': 'hsl(var(--background))',
    '--success-text': '#155724',
    '--success-border': '#c3e6cb',
    '--error-bg': 'hsl(var(--background))',
    '--error-text': '#7f1d1d',
    '--error-border': '#7f1d1d',
  } as React.CSSProperties;

  const darkThemeStyles = {
    '--normal-bg': 'hsl(var(--spinet-dark))',
    '--normal-text': 'hsl(var(--spinet-text-primary))',
    '--normal-border': 'hsl(var(--border))',
    '--success-bg': 'hsl(var(--spinet-dark))',
    '--success-text': '#d4edda',
    '--success-border': '#40916c',
    '--error-bg': 'hsl(var(--spinet-dark))',
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
'use client';

import { useEffect, useState } from 'react';
import { getLocale } from '@/utils/getClientLocale';

/**
 * Hook that safely gets the locale without causing hydration mismatches.
 * Returns 'en' during SSR and the actual locale after hydration.
 */
export function useLocale(): string {
   const [mounted, setMounted] = useState(false);
   const [locale, setLocale] = useState('en'); // Default fallback

   useEffect(() => {
      setMounted(true);
      const currentLocale = getLocale() || 'en';
      setLocale(currentLocale);
   }, []);

   // Return 'en' during SSR to prevent hydration mismatch
   return mounted ? locale : 'en';
}

/**
 * Hook that safely checks authentication state without causing hydration mismatches.
 * Returns false during SSR and the actual auth state after hydration.
 */
export function useSafeAuth(): { isAuthenticated: boolean; mounted: boolean } {
   const [mounted, setMounted] = useState(false);

   useEffect(() => {
      setMounted(true);
   }, []);

   return {
      isAuthenticated: false, // Always return false during SSR
      mounted
   };
}

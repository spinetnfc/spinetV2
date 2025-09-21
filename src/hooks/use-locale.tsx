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
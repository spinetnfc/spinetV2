'use client';

import { useEffect, useState } from 'react';
import { useLocale } from './use-locale';

interface TranslationFunction {
   (key: string, values?: Record<string, any>): string;
}

export function useClientTranslate(): { t: TranslationFunction; isReady: boolean } {
   const locale = useLocale();
   const [translations, setTranslations] = useState<Record<string, string>>({});
   const [isReady, setIsReady] = useState(false);

   useEffect(() => {
      const loadTranslations = async () => {
         try {
            const messages = await import(`../lang/${locale}.json`);
            setTranslations(messages.default || {});
            setIsReady(true);
         } catch (error) {
            console.error('Failed to load translations:', error);
            setIsReady(true); // Set ready even on error to prevent infinite loading
         }
      };

      setIsReady(false);
      loadTranslations();
   }, [locale]);

   const t: TranslationFunction = (key: string, values?: Record<string, any>) => {
      let translation = translations[key] || key;

      // Simple interpolation for values
      if (values) {
         Object.keys(values).forEach(valueKey => {
            translation = translation.replace(
               new RegExp(`{${valueKey}}`, 'g'),
               String(values[valueKey])
            );
         });
      }

      return translation;
   };

   return { t, isReady };
}

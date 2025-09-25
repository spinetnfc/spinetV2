'use client';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useOnboardingViewModel } from '@/lib/viewmodels/onboarding/onboarding.viewmodel';
import { useClientTranslate } from '@/hooks/use-client-translate';
import { DEFAULT_PROFILE_THEMES, ProfileTheme } from '@/types/onboarding';
import { Check, Palette } from 'lucide-react';

export default function Step4Theme() {
   const { t } = useClientTranslate();
   const { data, errors, selectTheme } = useOnboardingViewModel();

   return (
      <div className="space-y-6">

         {/* Theme Grid */}
         <div className="flex flex-wrap gap-3 justify-start items-center">
            {DEFAULT_PROFILE_THEMES.map((theme) => (
               <button
                  key={theme.id}
                  onClick={() => selectTheme(theme)}
                  className={`relative flex items-center justify-center p-0 m-0 border-none bg-transparent focus:outline-none`}
                  aria-label={theme.name}
                  type="button"
               >
                  <div
                     className={`w-8 h-8 rounded-full ${data.theme.id === theme.id ? 'ring-2 ring-primary ring-offset-2' : 'border border-black/80'} transition-all duration-150`}
                     style={{ backgroundColor: theme.primaryColor }}
                  />
               </button>
            ))}
         </div>

         {/* Error Display */}
         {errors.theme && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
               <p className="text-sm text-destructive">
                  {errors.theme}
               </p>
            </div>
         )}

         {/* Current Theme Info */}
         <div className="p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-3">
               <div
                  className="w-8 h-8 rounded border"
                  style={{ backgroundColor: data.theme.primaryColor }}
               />
               <div>
                  <p className="font-medium text-sm">
                     {t('onboarding.selected-theme')}: {data.theme.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                     {t('onboarding.theme-can-be-changed')}
                  </p>
               </div>
            </div>
         </div>

      </div>
   );
}

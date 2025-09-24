'use client';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useOnboardingStore } from '@/lib/store/onboarding/onboarding-store';
import { useClientTranslate } from '@/hooks/use-client-translate';
import { DEFAULT_PROFILE_THEMES, ProfileTheme } from '@/types/onboarding';
import { Check, Palette } from 'lucide-react';

export default function Step4Theme() {
   const { t } = useClientTranslate();
   const { data, updateTheme } = useOnboardingStore();

   const handleThemeChange = (theme: ProfileTheme) => {
      updateTheme(theme);
   };

   return (
      <div className="space-y-6">
         <div className="space-y-2">
            <div className="flex items-center gap-2">
               <Palette className="w-5 h-5" />
               <Label className="text-base font-medium">
                  {t('onboarding.choose-theme')}
               </Label>
            </div>
            <p className="text-sm text-muted-foreground">
               {t('onboarding.theme-description')}
            </p>
         </div>

         {/* Theme Grid */}
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {DEFAULT_PROFILE_THEMES.map((theme) => (
               <button
                  key={theme.id}
                  onClick={() => handleThemeChange(theme)}
                  className={`relative p-4 rounded-lg border-2 transition-all duration-200 ${data.theme.id === theme.id
                        ? 'border-primary bg-primary/5 shadow-md'
                        : 'border-border hover:border-primary/50 hover:shadow-sm'
                     }`}
               >
                  {/* Selected Indicator */}
                  {data.theme.id === theme.id && (
                     <div className="absolute top-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-primary-foreground" />
                     </div>
                  )}

                  {/* Theme Preview */}
                  <div
                     className="w-full h-20 rounded-md mb-3 border relative overflow-hidden"
                     style={{
                        backgroundColor: theme.backgroundColor,
                        color: theme.textColor,
                     }}
                  >
                     {/* Header Bar */}
                     <div
                        className="h-3 w-full"
                        style={{ backgroundColor: theme.primaryColor }}
                     />

                     {/* Content Preview */}
                     <div className="p-2 space-y-1">
                        <div
                           className="h-2 w-3/4 rounded"
                           style={{ backgroundColor: theme.textColor, opacity: 0.8 }}
                        />
                        <div
                           className="h-1.5 w-1/2 rounded"
                           style={{ backgroundColor: theme.textColor, opacity: 0.5 }}
                        />
                        <div
                           className="h-3 w-1/3 rounded mt-2"
                           style={{ backgroundColor: theme.primaryColor }}
                        />
                     </div>
                  </div>

                  {/* Theme Name */}
                  <h3 className="font-medium text-sm text-center">
                     {theme.name}
                  </h3>

                  {/* Color Palette */}
                  <div className="flex justify-center gap-1 mt-2">
                     <div
                        className="w-3 h-3 rounded-full border border-border/50"
                        style={{ backgroundColor: theme.primaryColor }}
                     />
                     <div
                        className="w-3 h-3 rounded-full border border-border/50"
                        style={{ backgroundColor: theme.backgroundColor }}
                     />
                     <div
                        className="w-3 h-3 rounded-full border border-border/50"
                        style={{ backgroundColor: theme.textColor }}
                     />
                  </div>
               </button>
            ))}
         </div>

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

         {/* Theme Preview Card */}
         <div className="border border-border rounded-lg overflow-hidden">
            <div
               className="p-4"
               style={{
                  backgroundColor: data.theme.backgroundColor,
                  color: data.theme.textColor,
               }}
            >
               <div
                  className="h-1 w-full mb-3 rounded"
                  style={{ backgroundColor: data.theme.primaryColor }}
               />
               <h4 className="font-semibold mb-2" style={{ color: data.theme.textColor }}>
                  {data.fullName || t('onboarding.your-name-placeholder')}
               </h4>
               <p className="text-sm opacity-80">
                  {t('onboarding.theme-preview-text')}
               </p>
               <Button
                  size="sm"
                  className="mt-3"
                  style={{
                     backgroundColor: data.theme.primaryColor,
                     color: '#ffffff',
                  }}
                  disabled
               >
                  {t('onboarding.sample-button')}
               </Button>
            </div>
         </div>
      </div>
   );
}

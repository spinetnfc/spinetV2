'use client';

import { Button } from '@/components/ui/button';
import { useOnboardingViewModel } from '@/lib/viewmodels/onboarding/onboarding.viewmodel';
import { useClientTranslate } from '@/hooks/use-client-translate';
import { DEFAULT_PROFILE_THEMES, ProfileTheme } from '@/types/onboarding';
import { Eye } from 'lucide-react';
import { useState } from 'react';
import { ProfilePreview } from '@/components/layouts/onboarding-layout';

export default function Step4Theme() {
   const { t } = useClientTranslate();
   const { data, errors, selectTheme } = useOnboardingViewModel();

   // Drawer state for mobile preview
   const [drawerOpen, setDrawerOpen] = useState(false);

   return (
      <div className="space-y-6">

         {/* Mobile Drawer for Profile Preview */}
         {drawerOpen && (
            <div className="fixed inset-0 z-50 flex items-end justify-center lg:hidden">
               {/* Overlay */}
               <div
                  className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                  onClick={() => setDrawerOpen(false)}
               />
               {/* Drawer */}
               <div className="relative w-full max-w-md md:max-w-lg bg-white rounded-t-2xl shadow-xl p-4 animate-slide-up">
                  <div className="flex justify-between items-center mb-2">
                     <span className="font-semibold text-lg">{t('onboarding.preview') || 'Preview'}</span>
                     <button onClick={() => setDrawerOpen(false)} className="text-gray-500 hover:text-gray-800 p-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                     </button>
                  </div>
                  <div className="overflow-y-auto max-h-[70vh] pb-2">
                     {/* ProfilePreview component (from layout) */}
                     <ProfilePreview currentStep={4} />
                  </div>
               </div>
               <style jsx>{`
                  .animate-slide-up {
                     animation: slideUpDrawer 0.25s cubic-bezier(0.4,0,0.2,1);
                  }
                  @keyframes slideUpDrawer {
                     from { transform: translateY(100%); }
                     to { transform: translateY(0); }
                  }
               `}</style>
            </div>
         )}

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

         {/* Mobile Preview Theme Button (only in step 4) */}
         <div className="block lg:hidden mb-2">
            <Button
               variant="outline"
               className="w-full flex items-center gap-2 justify-center border border-slate-200 hover:bg-slate-100 transition-all duration-200"
               onClick={() => setDrawerOpen(true)}
            >
               <Eye className="w-4 h-4" />
               {t('onboarding.preview') || 'Preview Theme'}
            </Button>
         </div>

      </div>
   );
}

'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useOnboardingViewModel } from '@/lib/viewmodels/onboarding/onboarding.viewmodel';
import { useClientTranslate } from '@/hooks/use-client-translate';

export default function Step1FullName() {
   const { t } = useClientTranslate();
   const { data, errors, updateFullName } = useOnboardingViewModel();

   return (
      <div className="space-y-6">
         <div className="space-y-2">
            <Label htmlFor="fullName" className="text-base font-medium">
               {t('onboarding.full-name-label')}
            </Label>
            <Input
               id="fullName"
               type="text"
               value={data.fullName}
               onChange={(e) => updateFullName(e.target.value)}
               placeholder={t('onboarding.full-name-placeholder')}
               className={`text-lg p-6 ${errors.fullName ? 'border-destructive focus-visible:ring-destructive' : ''}`}
            />
            {errors.fullName && (
               <p className="text-xs text-destructive mt-1">
                  {errors.fullName}
               </p>
            )}
            <p className="text-sm text-muted-foreground">
               {t('onboarding.full-name-description')}
            </p>
         </div>

         {/* Preview */}
         <div className="p-4 bg-muted/50 rounded-lg">
            <p className="text-sm font-medium text-muted-foreground mb-2">
               {t('onboarding.preview')}
            </p>
            <div className="text-lg font-semibold">
               {data.fullName || t('onboarding.your-name-placeholder')}
            </div>
         </div>
      </div>
   );
}

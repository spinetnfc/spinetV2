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
         <div className="space-y-3">
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
               autoComplete="name"
               autoFocus
            />
            {errors.fullName && (
               <p className="text-sm text-destructive mt-2 flex items-start gap-2">
                  <span>{errors.fullName}</span>
               </p>
            )}
         </div>
      </div>
   );
}

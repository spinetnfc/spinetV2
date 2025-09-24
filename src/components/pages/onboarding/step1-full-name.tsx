'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useOnboardingStore } from '@/lib/store/onboarding/onboarding-store';
import { useClientTranslate } from '@/hooks/use-client-translate';

export default function Step1FullName() {
   const { t } = useClientTranslate();
   const { data, updateFullName } = useOnboardingStore();

   const handleFullNameChange = (value: string) => {
      updateFullName(value);
   };

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
               onChange={(e) => handleFullNameChange(e.target.value)}
               placeholder={t('onboarding.full-name-placeholder')}
               className="text-lg p-6"
            />
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

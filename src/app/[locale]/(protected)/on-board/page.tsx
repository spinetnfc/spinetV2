'use client';

import OnboardingLayout from '@/components/layouts/onboarding-layout';
import Step1FullName from '@/components/pages/onboarding/step1-full-name';
import Step2Links from '@/components/pages/onboarding/step2-links';
import Step3ProfilePicture from '@/components/pages/onboarding/step3-profile-picture';
import Step4Theme from '@/components/pages/onboarding/step4-theme';
import Step5Organization from '@/components/pages/onboarding/step5-organization';
import { useOnboardingStore } from '@/lib/store/onboarding/onboarding-store';

export default function OnboardingPage() {
   const { currentStep } = useOnboardingStore();

   const renderCurrentStep = () => {
      switch (currentStep) {
         case 1:
            return <Step1FullName />;
         case 2:
            return <Step2Links />;
         case 3:
            return <Step3ProfilePicture />;
         case 4:
            return <Step4Theme />;
         case 5:
            return <Step5Organization />;
         default:
            return <Step1FullName />;
      }
   };

   return (
      <OnboardingLayout>
         {renderCurrentStep()}
      </OnboardingLayout>
   );
}
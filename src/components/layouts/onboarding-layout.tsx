'use client';

import Link from 'next/link';
import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { useOnboardingViewModel } from '@/lib/viewmodels/onboarding/onboarding.viewmodel';
import { useClientTranslate } from '@/hooks/use-client-translate';
import SpinetLogo from '@/components/icons/spinet-logo';
import { ArrowLeft } from 'lucide-react';
import { useLocale } from '@/hooks/use-locale';

interface OnboardingLayoutProps {
   children: ReactNode;
}

export default function OnboardingLayout({ children }: OnboardingLayoutProps) {
   const locale = useLocale();
   const { t } = useClientTranslate();

   const {
      currentStep,
      data,
      isLoading,
      errors,
      getStepInfo,
      getProgressPercentage,
      isFinalStep,
      isFirstStep,
      canProceedToNextStep,
      nextStep,
      previousStep,
      skipStep,
      exitOnboarding,
   } = useOnboardingViewModel();

   // Get current step info
   const stepInfo = getStepInfo(currentStep);
   const progress = getProgressPercentage();
   const canProceed = canProceedToNextStep();

   return (
      <div className="flex min-h-screen">
         {/* Left Side - Form Content */}
         <div className="w-full lg:w-1/2 p-6 lg:p-12">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
               <div className="flex items-center gap-4">
                  {/* Logo and Back Button */}
                  <button
                     onClick={exitOnboarding}
                     className="flex items-center gap-3 text-foreground hover:text-muted-foreground transition-colors"
                  >
                     <ArrowLeft className="h-5 w-5" />
                     <SpinetLogo className="hover:cursor-pointer w-28 md:w-40" width={151} height={31} />
                  </button>
               </div>
            </div>

            {/* Progress */}
            <div className="mb-8">
               <p className="text-sm text-muted-foreground mb-2">
                  {t('onboarding.step-of', { current: currentStep, total: 5 })}
               </p>
               <div className="w-full bg-muted rounded-full h-2">
                  <div
                     className="bg-primary h-2 rounded-full transition-all duration-300"
                     style={{ width: `${progress}%` }}
                  />
               </div>
            </div>

            {/* Step Content */}
            <div className="mb-8">
               <h1 className="text-3xl font-bold text-foreground mb-4">
                  {stepInfo.title}
               </h1>
               <p className="text-muted-foreground text-lg">
                  {stepInfo.description}
               </p>
            </div>

            {/* Step Components - This is where children will be rendered */}
            <div className="mb-8">
               {children}
            </div>

            {/* Error Display */}
            {Object.keys(errors).length > 0 && (
               <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                  {Object.values(errors).map((error, index) => (
                     <p key={index} className="text-destructive text-sm">
                        {error}
                     </p>
                  ))}
               </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between">
               <Button
                  variant="outline"
                  onClick={previousStep}
                  disabled={isFirstStep()}
                  className="px-6"
               >
                  {t('onboarding.previous')}
               </Button>

               <div className="flex gap-3">
                  {(currentStep === 2 || currentStep === 3 || currentStep === 5) && (
                     <Button
                        variant="ghost"
                        onClick={skipStep}
                        disabled={isLoading}
                        className="text-muted-foreground"
                     >
                        {t('onboarding.skip')}
                     </Button>
                  )}

                  <Button
                     onClick={nextStep}
                     disabled={!canProceed || isLoading}
                     className="px-6"
                  >
                     {isLoading ? (
                        <div className="flex items-center gap-2">
                           <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                           {t('onboarding.completing')}
                        </div>
                     ) : isFinalStep() ? (
                        t('onboarding.complete')
                     ) : (
                        t('onboarding.continue')
                     )}
                  </Button>
               </div>
            </div>
         </div>

         {/* Right Side - Profile Preview (Hidden on Mobile) */}
         <div className="hidden lg:flex lg:w-1/2 bg-muted/30 items-center justify-center p-12">
            <ProfilePreview />
         </div>
      </div>
   );
}

function ProfilePreview() {
   const { data } = useOnboardingViewModel();

   return (
      <div className="w-80 bg-background border border-border rounded-xl p-6">
         <div className="text-center space-y-4">
            {/* Profile Picture */}
            <div className="w-20 h-20 mx-auto rounded-full overflow-hidden bg-muted">
               {data.profilePicture ? (
                  <img src={data.profilePicture} alt="Profile" className="w-full h-full object-cover" />
               ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                     No Image
                  </div>
               )}
            </div>

            {/* Name */}
            <h3 className="text-lg font-semibold">
               {data.fullName || 'Your Name'}
            </h3>

            {/* Links */}
            {data.links.length > 0 && (
               <div className="space-y-2">
                  {data.links.map((link, index) => (
                     <div key={index} className="p-2 bg-muted rounded text-sm">
                        {link.platform}
                     </div>
                  ))}
               </div>
            )}

            {/* Theme Preview */}
            <div
               className="p-3 rounded text-sm"
               style={{
                  backgroundColor: data.theme.primaryColor + '20',
                  color: data.theme.textColor
               }}
            >
               Theme: {data.theme.name}
            </div>

            {/* Organization */}
            {data.organization && (
               <div className="p-2 bg-muted rounded text-sm">
                  {data.organization.name}
                  {data.organization.members.length > 0 && (
                     <div className="text-xs text-muted-foreground mt-1">
                        {data.organization.members.length} member(s)
                     </div>
                  )}
               </div>
            )}
         </div>
      </div>
   );
}

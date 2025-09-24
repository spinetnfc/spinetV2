'use client';

import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { useOnboardingViewModel } from '@/lib/viewmodels/onboarding/onboarding.viewmodel';
import { useClientTranslate } from '@/hooks/use-client-translate';
import SpinetLogo from '@/components/icons/spinet-logo';
import { ChevronLeft } from 'lucide-react';
import { useLocale } from '@/hooks/use-locale';

interface OnboardingLayoutProps {
   children: ReactNode;
}

export default function OnboardingLayout({ children }: OnboardingLayoutProps) {
   const { t } = useClientTranslate();

   const {
      data,
      currentStep,
      isLoading,
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
         <div className="w-full lg:w-1/2 p-6 sm:p-20 lg:p-24">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
               <div className="flex items-center gap-4">
                  {/* Logo and Back Button */}
                  <button
                     onClick={exitOnboarding}
                     className="flex items-center gap-3 text-foreground hover:text-muted-foreground transition-colors"
                  >
                     <ChevronLeft className="h-5 w-5" />
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
            <div className="mt-20 mb-8">
               <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
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

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between">
               {/* Previous Button - Only show if not first step */}
               {!isFirstStep() && (
                  <Button
                     variant="outline"
                     onClick={previousStep}
                     className="px-6"
                  >
                     {t('onboarding.previous')}
                  </Button>
               )}

               {/* Spacer for first step to push next button to the right */}
               {isFirstStep() && <div></div>}

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

         {/* Right Side - Dashboard Profile Preview (Hidden on Mobile) */}
         <div
            className="hidden lg:flex lg:w-1/2 items-center justify-end p-0 transition-colors duration-500 ease-out"
            style={{ backgroundColor: data.theme.backgroundColor }}
         >
            <div className="w-full flex justify-end">
               <ProfilePreview />
            </div>
         </div>
      </div>
   );
}

function ProfilePreview() {
   const { data } = useOnboardingViewModel();

   return (
      <div className="w-[70%]">
         {/* Dashboard-like Layout */}
         <div
            className="relative bg-white rounded-xl shadow-xl overflow-hidden transition-all duration-300 ease-out"
            style={{
               backgroundColor: 'white',
               minHeight: '500px'
            }}
         >
            {/* Blue Sidebar */}
            <div
               className="absolute left-0 top-0 w-16 h-full flex flex-col items-center py-6 transition-colors duration-300 ease-out"
               style={{ backgroundColor: data.theme.primaryColor }}
            >
               {/* Navigation Icons */}
               <div className="flex flex-col gap-6 mb-auto">
                  {/* Home Icon */}
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                     <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                     </svg>
                  </div>

                  {/* Links Icon */}
                  <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                     <svg className="w-4 h-4 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.1m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                     </svg>
                  </div>

                  {/* More Options Icon */}
                  <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                     <svg className="w-4 h-4 text-white/70" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                     </svg>
                  </div>
               </div>

               {/* Profile Avatar at Bottom */}
               <div className="mt-auto">
                  <div
                     className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/30"
                  >
                     {data.profilePicture ? (
                        <img
                           src={data.profilePicture}
                           alt="Profile"
                           className="w-full h-full object-cover"
                        />
                     ) : (
                        <div
                           className="w-full h-full flex items-center justify-center text-lg font-bold text-white"
                           style={{ backgroundColor: data.theme.primaryColor }}
                        >
                           {data.fullName ? data.fullName.charAt(0).toUpperCase() : '?'}
                        </div>
                     )}
                  </div>
               </div>
            </div>

            {/* Main Content Area */}
            <div className="ml-16 p-6">
               {/* Header */}
               <div className="mb-6">
                  <h2
                     className="text-xl font-bold mb-1 transition-colors duration-300 ease-out"
                     style={{ color: data.theme.textColor }}
                  >
                     {data.fullName || 'Your Name'}
                  </h2>
               </div>

               {/* Content Placeholders */}
               <div className="space-y-4">
                  {/* Large Content Block */}
                  <div
                     className="h-20 rounded-lg opacity-20"
                     style={{ backgroundColor: data.theme.textColor }}
                  ></div>

                  {/* Medium Content Blocks */}
                  <div className="space-y-2">
                     <div
                        className="h-4 rounded w-full opacity-20"
                        style={{ backgroundColor: data.theme.textColor }}
                     ></div>
                     <div
                        className="h-4 rounded w-3/4 opacity-20"
                        style={{ backgroundColor: data.theme.textColor }}
                     ></div>
                     <div
                        className="h-4 rounded w-2/3 opacity-20"
                        style={{ backgroundColor: data.theme.textColor }}
                     ></div>
                  </div>

                  {/* Spacing */}
                  <div className="h-8"></div>

                  {/* More Content Blocks */}
                  <div className="space-y-2">
                     <div
                        className="h-4 rounded w-full opacity-20"
                        style={{ backgroundColor: data.theme.textColor }}
                     ></div>
                     <div
                        className="h-4 rounded w-4/5 opacity-20"
                        style={{ backgroundColor: data.theme.textColor }}
                     ></div>
                  </div>

                  {/* Spacing */}
                  <div className="h-12"></div>

                  {/* Bottom Content Block */}
                  <div
                     className="h-16 rounded-lg opacity-20"
                     style={{ backgroundColor: data.theme.textColor }}
                  ></div>
               </div>

               {/* Navigation Labels (visible on hover or as text) */}
               <div className="absolute left-20 top-6 opacity-0 hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                  <div className="space-y-6 text-xs text-gray-500">
                     <div className="py-2">Home</div>
                     <div className="py-2">My links</div>
                     <div className="py-2">More</div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
}

"use client";

import React, { useState } from 'react';
import SpinetLogo from '@/components/icons/spinet-logo';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useClientTranslate } from '@/hooks/use-client-translate';


export default function OnBoardLanding() {
   const [isVerified] = useState(false);
   const email = 'spinet.user@gmail.com';
   const { t } = useClientTranslate();

   const renderInterpolated = (template: string, values: Record<string, React.ReactNode>) => {
      if (!template) return null;
      const parts = template.split(/({[^}]+})/g).filter(Boolean);
      return parts.map((part, idx) => {
         const match = part.match(/^{(.+)}$/);
         if (match) {
            const key = match[1];
            return <React.Fragment key={idx}>{values[key] ?? ''}</React.Fragment>;
         }
         return <React.Fragment key={idx}>{part}</React.Fragment>;
      });
   };

   return (
      <div className="min-h-screen flex flex-col items-center bg-white">
         {/* Top Logo and badge */}
         <div className="flex flex-col items-center pt-12 lg:pt-24 pb-10 lg:pb-20 px-4 lg:px-8">
            {/* Logo */}
            <SpinetLogo className="hover:cursor-pointer w-28 md:w-40 mb-8" width={151} height={31} />

            {/* Email badge */}
            <div className="flex justify-center w-full">
               <div className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-gray-100 text-sm font-medium">
                  {isVerified ? (
                     <>
                        <span className="font-semibold text-gray-900">{t('onboard.verified.email', { email })}</span>
                        <span className="text-green-500 font-semibold ml-8">{t('onboard.verified.status')}</span>
                        <svg
                           className="w-5 h-5 text-green-500"
                           fill="none"
                           stroke="currentColor"
                           strokeWidth="2"
                           viewBox="0 0 24 24"
                        >
                           <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5 13l4 4L19 7"
                           />
                        </svg>
                     </>
                  ) : (
                     <>
                        <span className="text-gray-700">
                           {t('onboard.verify.message', { email })}
                        </span>
                        <button className="ml-8 cursor-pointer text-blue-600 font-semibold hover:text-blue-700 transition-colors">
                           {t('onboard.verify.verifyButton')}
                        </button>
                     </>
                  )}
               </div>
            </div>
         </div>

         {/* Main Content */}
         <div className="w-full px-6 lg:px-12 flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-16">
            {/* Left Side */}
            <div className="text-center lg:text-start flex flex-col justify-center items-start max-w-2xl w-full lg:order-1 order-2">
               <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                  {t('onboard.heading')}
               </h1>
               <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                  {t('onboard.subtitle')}
               </p>
               <Button
                  variant="default"
                  className="w-full px-8 py-5 font-medium mb-6 transition-all duration-200"
               >
                  {t('onboard.cta')}
               </Button>
               <p className="text-sm text-gray-500">
                  {renderInterpolated(t('onboard.terms'), {
                     terms: <a href="#" className="underline hover:text-spinet-primary transition-colors">{t('terms-and-conditions')}</a>,
                     privacy: <a href="#" className="underline hover:text-spinet-primary transition-colors">{t('privacy-policy')}</a>,
                  })}
               </p>
            </div>

            {/* Right Side - Images */}
            <div className="flex flex-col items-center justify-center gap-8 lg:order-2 order-1">
               {/* Top illustration */}
               <div className="w-full max-w-md">
                  <Image
                     src={require('@/assets/images/on-board/landing1.png')}
                     alt={t('onboard.heading')}
                     className="w-full h-auto"
                     priority
                  />
               </div>

               {/* Bottom illustrations - hidden on mobile, shown on desktop */}
               <div className="hidden lg:flex gap-8">
                  <div className="w-48">
                     <Image
                        src={require('@/assets/images/on-board/landing2.png')}
                        alt={t('onboard.subtitle')}
                        className="w-full h-auto"
                     />
                  </div>
                  <div className="w-48">
                     <Image
                        src={require('@/assets/images/on-board/landing3.png')}
                        alt={t('onboard.subtitle')}
                        className="w-full h-auto"
                     />
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
}
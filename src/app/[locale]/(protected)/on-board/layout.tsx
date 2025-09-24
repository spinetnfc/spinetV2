import { ReactNode } from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
   title: 'Onboarding - Spinet',
   description: 'Complete your profile setup to get started with Spinet',
   robots: 'noindex, nofollow', // Don't index onboarding pages
};

export default function OnboardingLayoutWrapper({
   children,
}: {
   children: ReactNode;
}) {
   return (
      <div className="min-h-screen bg-background">
         {children}
      </div>
   );
}
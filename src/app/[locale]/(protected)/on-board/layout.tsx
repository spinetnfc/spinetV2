import { ReactNode } from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
   title: 'Onboarding - Spinet',
   description: 'Complete your profile setup to get started with Spinet',
   robots: 'noindex, nofollow',
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
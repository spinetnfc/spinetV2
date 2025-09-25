import React from 'react';

export const metadata = {
   title: 'Onboarding - Spinet',
   description: 'Welcome to the onboarding landing page before starting the onboarding steps.'
};

export default function OnBoardLandingLayout({ children }: { children: React.ReactNode }) {
   return <div>{children}</div>;
}

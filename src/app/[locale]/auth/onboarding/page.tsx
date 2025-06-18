import React from 'react';

import Register from '@/components/pages/auth/register';
import Onboarding from '@/components/pages/auth/onboarding';

async function OnboardingPage({ params }: { params: Promise<{ locale: string, profile: string }> }) {
    const { locale, profile } = await params;
    return <Onboarding locale={locale} profile={profile} />;
}

export default OnboardingPage;

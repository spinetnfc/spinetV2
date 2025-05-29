import React from 'react';
import GoogleSignIn from '@/components/pages/auth/google-login';

async function getMessages(locale: string) {
    return (await import(`../../../../../lang/${locale}.json`)).default;
}

const GoogleLoginPage = async ({ params }: { params: Promise<{ locale: string }> }) => {
    const { locale } = await params;
    const messages = await getMessages(locale);

    return <GoogleSignIn />;
};

export default GoogleLoginPage;

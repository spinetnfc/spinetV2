import React from 'react';
import SSOForm from '@/components/pages/auth/sso-form';

const SSOPage = async ({ params }: { params: Promise<{ locale: string }> }) => {
   const { locale } = await params;

   return <SSOForm />;
};

export default SSOPage;

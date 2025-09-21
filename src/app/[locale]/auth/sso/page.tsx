import React from 'react';
import SSOForm from '@/components/pages/auth/sso-form';

const SSOPage = async ({ params }: { params: Promise<{ locale: string }> }) => {
   return <SSOForm />;
};

export default SSOPage;

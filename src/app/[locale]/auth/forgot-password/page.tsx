import React from 'react';
import PasswordRecoveryForm from '@/components/pages/auth/password-recovery-form';

const ForgotPasswordPage = async ({ params }: { params: Promise<{ locale: string }> }) => {
   const { locale } = await params;

   return <PasswordRecoveryForm />;
};

export default ForgotPasswordPage;

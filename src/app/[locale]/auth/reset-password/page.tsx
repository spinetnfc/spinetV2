import React from 'react';
import PasswordResetForm from '@/components/pages/auth/password-reset-form';

const ResetPasswordPage = async ({ params }: { params: Promise<{ locale: string }> }) => {
   return <PasswordResetForm />;
};

export default ResetPasswordPage;

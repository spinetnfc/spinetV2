import React from 'react';
import OTPVerificationForm from '@/components/pages/auth/otp-verification-form';

const VerifyOTPPage = async ({ params }: { params: Promise<{ locale: string }> }) => {
   const { locale } = await params;

   return <OTPVerificationForm />;
};

export default VerifyOTPPage;

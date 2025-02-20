'use client';
import React, { useState } from 'react';
import { IntlProvider } from 'react-intl';

import EmailForm from '@/components/pages/auth/forgot-password/email-form';
import NewPasswordForm from '@/components/pages/auth/forgot-password/new-password-form';
import OtpForm from '@/components/pages/auth/forgot-password/otp-form';

// New Password Validation Schema

const ForgotPassword = ({
  locale,
  messages,
}: {
  locale: string;
  messages: Record<string, string>;
}) => {
  const [step, setStep] = useState<'email' | 'otp' | 'newPassword'>('email');
  const [email, setEmail] = useState('');
  return (
    <IntlProvider locale={locale} messages={messages}>
      <div className="z-50 w-full max-w-[800px] space-y-6 rounded-lg p-4 xs:p-8 text-[#0D2C60] lg:shadow-md dark:text-[#EEF6FF] lg:bg-white lg:dark:bg-[#010E37]">
        {step === 'email' && (
          <EmailForm setEmail={setEmail} setStep={setStep} locale={locale} />
        )}
        {step === 'otp' && <OtpForm email={email} setStep={setStep} />}
        {step === 'newPassword' && <NewPasswordForm email={email} />}
      </div>
    </IntlProvider>
  );
};

export default ForgotPassword;

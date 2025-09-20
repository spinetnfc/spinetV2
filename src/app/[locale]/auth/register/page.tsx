import React from 'react';
import RegisterForm from '@/components/pages/auth/register-form';

async function RegisterPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  return <RegisterForm />;
}

export default RegisterPage;

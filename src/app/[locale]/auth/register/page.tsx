import React from 'react';
import RegisterForm from '@/components/pages/auth/register-form';

async function RegisterPage({ params }: { params: Promise<{ locale: string }> }) {
  return <RegisterForm />;
}

export default RegisterPage;

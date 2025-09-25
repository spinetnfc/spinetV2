import React from 'react';
import LoginForm from '@/components/pages/auth/login-form';

const LoginPage = async ({ params }: { params: Promise<{ locale: string }> }) => {
  return <LoginForm />;
};

export default LoginPage;

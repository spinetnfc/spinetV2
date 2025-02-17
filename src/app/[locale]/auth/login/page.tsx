import React from 'react';
import Login from '@/components/pages/login';

async function getMessages(locale: string) {
  return (await import(`../../../../lang/${locale}.json`)).default;
}

const LoginPage = async ({ params }: { params: Promise<{ locale: string }> }) => {
  const { locale } = await params;
  const messages = await getMessages(locale);

  return <Login locale={locale} messages={messages} />;
};

export default LoginPage;

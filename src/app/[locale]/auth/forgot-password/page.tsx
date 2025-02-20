import React from 'react';
import ForgotPassword from '@/components/pages/auth/forgot-password/forgot-password';

async function getMessages(locale: string) {
  return (await import(`../../../../lang/${locale}.json`)).default;
}

const Page = async ({ params }: { params: Promise<{ locale: string }> }) => {
  const { locale } = await params;
  const messages = await getMessages(locale);

  return <ForgotPassword locale={locale} messages={messages} />;
};

export default Page;

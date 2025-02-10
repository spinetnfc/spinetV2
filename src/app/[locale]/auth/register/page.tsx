import React from 'react';

import Register from '@/components/pages/register';

async function getMessages(locale: string) {
  return await import(`../../../../lang/${locale}.json`);
}
async function LoginPage({ params }: {
  params: { locale: string } | Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = (await getMessages(locale)).default;

  return <Register locale={locale} messages={messages} />;
}

export default LoginPage;

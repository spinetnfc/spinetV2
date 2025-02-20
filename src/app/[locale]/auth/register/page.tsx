import React from 'react';

import Register from '@/components/pages/auth/register';

async function getMessages(locale: string) {
  return await import(`../../../../lang/${locale}.json`);
}
async function LoginPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const messages = (await getMessages(locale)).default;

  return <Register locale={locale} messages={messages} />;
}

export default LoginPage;

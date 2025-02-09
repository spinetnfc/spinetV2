import React from 'react';

import Register from '@/components/pages/register';

type Props = { params: { locale: string } };
async function getMessages(locale: string) {
  return await import(`../../../../lang/${locale}.json`);
}
async function LoginPage({ params: { locale } }: Props) {
  const messages = (await getMessages(locale)).default;

  return <Register locale={locale} messages={messages} />;
}

export default LoginPage;

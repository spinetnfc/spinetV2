import React from 'react';

import Login from '@/components/pages/login';

type Props = { params: { locale: string } };
async function getMessages(locale: string) {
  return await import(`../../../../lang/${locale}.json`);
}
async function LoginPage({ params: { locale } }: Props) {
  const messages = (await getMessages(locale)).default;

  return <Login locale={locale} messages={messages} />;
}

export default LoginPage;

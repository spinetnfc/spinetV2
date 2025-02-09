import React from 'react';

import ForgotPassword from '@/components/pages/forgot-password/forgot-password';

async function getMessages(locale: string) {
  return await import(`../../../../lang/${locale}.json`);
}
async function page({ params: { locale } }: { params: { locale: string } }) {
  const messages = (await getMessages(locale)).default;

  return <ForgotPassword locale={locale} messages={messages} />;
}

export default page;

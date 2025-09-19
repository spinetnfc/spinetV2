'use client';
import React from 'react';
import { IntlProvider } from 'react-intl';

import FaqQuestions from './faq-questions';
import SubmitQuestionForm from './submit-question';

type Props = {
  locale: string;
  messages: Record<string, string>;
};

function Faq({ locale, messages }: Props) {
  return (
    <IntlProvider locale={locale} messages={messages}>
      <div className="flex flex-col items-center justify-center gap-6 px-4 py-12 lg:flex-row lg:gap-8 lg:px-8 lg:py-16">
        <FaqQuestions />
        <SubmitQuestionForm />
      </div>
    </IntlProvider>
  );
}

export default Faq;

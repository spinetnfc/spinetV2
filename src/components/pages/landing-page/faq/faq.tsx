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
      <div className=" flex flex-col items-center justify-center gap-4 px-4  lg:flex-row lg:gap-8 lg:px-8  ">
        <FaqQuestions />
        <SubmitQuestionForm />
      </div>
    </IntlProvider>
  );
}

export default Faq;

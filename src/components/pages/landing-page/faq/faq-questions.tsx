import React from 'react';
import { FormattedMessage } from 'react-intl';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const FaqQuestions = () => {
  const faqs = [
    {
      question: 'q1',
      answer: 'q1-answer',
    },
    {
      question: 'q2',
      answer: 'q2-answer',
    },
    {
      question: 'q3',
      answer: 'q3-answer',
    },
  ];

  return (
    <div className="w-[590px] max-w-full text-spinet-deep dark:text-spinet-light">
      <h1 className="mb-6 text-4xl sm:text-5xl font-bold leading-[60px] ">
        <FormattedMessage id="got-a-question" />
      </h1>
      <p className="mb-6 text-lg sm:text-xl leading-[38px] text-spinet-text-muted">
        <FormattedMessage id="got-a-question-text" />
      </p>
      <Accordion type="single" collapsible className="space-y-4">
        {faqs.map((faq, index) => (
          <AccordionItem
            key={index}
            value={`item-${index}`}
            className="w-full border-b border-[#152656] py-2"
          >
            <AccordionTrigger className="flex cursor-pointer items-center justify-between ">
              <span className="text-left text-lg  leading-8">
                <FormattedMessage id={faq.question} />
              </span>
            </AccordionTrigger>
            <AccordionContent className="mt-2 leading-[25px] text-spinet-text-muted">
              <FormattedMessage id={faq.answer} />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default FaqQuestions;

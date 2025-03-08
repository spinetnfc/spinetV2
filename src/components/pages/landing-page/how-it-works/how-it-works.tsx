import { ChevronRight } from 'lucide-react';
import React from 'react';

import useTranslate from '@/hooks/use-translate';

import CtaButton from '../cta-button';
import Legend from '../legend';

import StepCard from './step-card';

type Props = { locale: string };

async function HowItWorks({ locale }: Props) {
  const { t } = await useTranslate(locale);
  const steps = [
    {
      imageUrl: '/img/how-it-works/1.png',

      text: 'create-an-account',
      ordinal: 'first',
    },
    {
      imageUrl: '/img/how-it-works/2.png',
      text: 'set-up-your-profile',
      ordinal: 'second',
    },
    {
      imageUrl: '/img/how-it-works/3.png',
      text: 'active-spinet-product',
      ordinal: 'third',
    },
    {
      imageUrl: '/img/how-it-works/4.png',
      text: 'exchange-contact-and-collect-leads',
      ordinal: 'fourth',
    },
  ];
  return (
    <div className=" flex w-full flex-col items-center justify-center  gap-2.5   px-3 py-1.5  lg:gap-4">
      <Legend text="Experience Our Seamless Process" locale={locale} />
      <div className="  text-center text-4xl sm:text-5xl leading-[60px] text-[#1A3B8E] dark:text-white">
        {t('how-it-works')}
      </div>

      <div className="flex  items-center justify-center text-center text-lg sm:text-xl  text-[#1A3B8E]/80  dark:text-white">
        {t('how-it-works-text')}
      </div>

      <CtaButton
        icon={<ChevronRight className="ms-2.5 size-6" />}
        text={t('book-a-demo')}
        className="max-w-[308px] w-full mt-4"
        iconposition="right"
      />
      <div className="mt-8 flex h-fit w-full flex-col items-center justify-center lg:flex-row">
        {steps.map((step, index) => (
          <StepCard
            key={index}
            imageUrl={step.imageUrl}
            text={t(step.text)}
            ordinal={t(step.ordinal)}
          />
        ))}
      </div>
    </div>
  );
}

export default HowItWorks;

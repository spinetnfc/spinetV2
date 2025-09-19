import { ChevronRight } from 'lucide-react';
import React from 'react';
import useTranslate from '@/hooks/use-translate';
import CtaButton from '../cta-button';
import Legend from '../legend';
import StepCard from './step-card';
import howItWorks1 from '@/assets/images/how-it-works/1.png';
import howItWorks2 from '@/assets/images/how-it-works/2.png';
import howItWorks3 from '@/assets/images/how-it-works/3.png';
import howItWorks3Light from '@/assets/images/how-it-works/3-light.png';
import howItWorks4 from '@/assets/images/how-it-works/4.png';
import howItWorks4Light from '@/assets/images/how-it-works/4-light.png';

type Props = { locale: string };

async function HowItWorks({ locale }: Props) {
  const { t } = await useTranslate(locale);
  const steps = [
    {
      imageUrl: howItWorks1,
      text: 'create-an-account',
      ordinal: 'first',
    },
    {
      imageUrl: howItWorks2,
      text: 'set-up-your-profile',
      ordinal: 'second',
    },
    {
      imageUrl: howItWorks3,
      imageUrlLight: howItWorks3Light,
      text: 'active-spinet-product',
      ordinal: 'third',
    },
    {
      imageUrl: howItWorks4,
      imageUrlLight: howItWorks4Light,
      text: 'exchange-contact-and-collect-leads',
      ordinal: 'fourth',
    },
  ];
  return (
    <div className=" flex w-full flex-col items-center justify-center  gap-2.5   px-3 py-1.5  lg:gap-4">
      <Legend text="Experience Our Seamless Process" locale={locale} />
      <div className="text-center text-4xl sm:text-5xl leading-[60px] text-spinet-deep">
        {t('how-it-works')}
      </div>

      <div className="flex items-center justify-center text-center text-lg sm:text-xl text-spinet-text-muted">
        {t('how-it-works-text')}
      </div>

      <CtaButton
        icon={<ChevronRight className="ms-2.5 size-6" />}
        text={t('book-a-demo')}
        className=" w-fit mt-4 text-base xs:text-xl"
        iconposition="right"
      />
      <div className="mt-8 flex h-fit w-full flex-col items-center justify-center lg:flex-row">
        {steps.map((step, index) => (
          <StepCard
            key={index}
            imageUrl={step.imageUrl}
            imageUrlLight={step.imageUrlLight}
            text={t(step.text)}
            ordinal={t(step.ordinal)}
          />
        ))}
      </div>
    </div>
  );
}

export default HowItWorks;

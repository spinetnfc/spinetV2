/* eslint-disable jsx-a11y/no-static-element-interactions */
'use client';
import { ChevronDown, ChevronUp } from 'lucide-react';
import React, { useState } from 'react';
import { FormattedMessage, IntlProvider, useIntl } from 'react-intl';

import Legend from '../legend';

import ComparePlans from './compare-plans';
import Options from './options';
import Pricing from './pricing';

type Props = { locale: string; messages: Record<string, string> };

function ChoosePlan({ locale, messages }: Props) {
  return (
    <IntlProvider locale={locale} messages={messages}>
      <ChoosePlanContent locale={locale} />
    </IntlProvider>
  );
}

export default ChoosePlan;

const ChoosePlanContent = ({ locale }: { locale: string }) => {
  const intl = useIntl();
  const [isComparePlansOpen, setIsComparePlansOpen] = useState(false);
  const [isYearly, setIsYearly] = useState(false);
  return (
    <div className=" flex w-full flex-col items-center justify-center gap-2.5 overflow-x-hidden px-3 py-1.5  lg:gap-4">
      <Legend
        text={intl.formatMessage({ id: 'affordable-solutions' })}
        locale={locale}
      />
      <div className=" text-center text-5xl leading-[60px] text-[#1A3B8E] dark:text-white">
        <FormattedMessage id="choose-your-plans" />
      </div>
      <div className="flex items-center justify-center text-center text-xl text-[#1A3B8E]/80 dark:text-white">
        <FormattedMessage id="choose-your-plans-text" />
      </div>
      <Options isYearly={isYearly} setIsYearly={setIsYearly} />
      <Pricing />
      <div
        className="flex flex-row items-center gap-2 rounded-xl  hover:cursor-pointer dark:text-[#F4F0FF]"
        onClick={() => setIsComparePlansOpen(!isComparePlansOpen)}
        onKeyPress={() => setIsComparePlansOpen(!isComparePlansOpen)}
      >
        <span className="text-sm font-medium ">
          <FormattedMessage id="compare-plans" />
        </span>
        {isComparePlansOpen ? (
          <ChevronUp className="size-5" />
        ) : (
          <ChevronDown className="size-5 " />
        )}
      </div>
      {isComparePlansOpen && <ComparePlans />}
    </div>
  );
};

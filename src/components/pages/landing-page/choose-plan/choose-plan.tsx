/* eslint-disable jsx-a11y/no-static-element-interactions */
'use client';
import { ChevronDown, ChevronUp } from 'lucide-react';
import React, { useState } from 'react';
import { FormattedMessage, IntlProvider, useIntl } from 'react-intl';

import Legend from '../legend';

import ComparePlans from './compare-plans';
import Options from './options';
import Pricing from './pricing';
import { getLocale } from '@/utils/getClientLocale';

type Props = { messages: Record<string, string> };



const ChoosePlan = () => {
  const intl = useIntl();
  const [isComparePlansOpen, setIsComparePlansOpen] = useState(false);
  const [isYearly, setIsYearly] = useState(false);
  const locale = getLocale() || "en";

  return (
    <div className="flex w-full flex-col items-center justify-center gap-6 overflow-x-hidden px-4 py-12 lg:gap-8 lg:px-8">
      {/* Section Header */}
      <div className="flex flex-col items-center gap-4 text-center max-w-4xl mx-auto">
        <Legend
          text={intl.formatMessage({ id: 'affordable-solutions' })}
          locale={locale}
        />
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-spinet-deep dark:text-spinet-light">
          <FormattedMessage id="choose-your-plans" />
        </h2>
        <p className="text-lg sm:text-xl text-spinet-text-muted max-w-2xl">
          <FormattedMessage id="choose-your-plans-text" />
        </p>
      </div>

      {/* Billing Toggle */}
      <Options isYearly={isYearly} setIsYearly={setIsYearly} />

      {/* Pricing Cards */}
      <div className="w-full max-w-7xl">
        <Pricing />
      </div>

      {/* Compare Plans Toggle */}
      <div
        className="flex flex-row items-center gap-2 rounded-xl px-4 py-2 cursor-pointer transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
        onClick={() => setIsComparePlansOpen(!isComparePlansOpen)}
        onKeyPress={() => setIsComparePlansOpen(!isComparePlansOpen)}
      >
        <span className="text-sm font-medium text-spinet-text-primary">
          <FormattedMessage id="compare-plans" />
        </span>
        {isComparePlansOpen ? (
          <ChevronUp className="size-5 text-spinet-text-primary" />
        ) : (
          <ChevronDown className="size-5 text-spinet-text-primary" />
        )}
      </div>

      {/* Compare Plans Section */}
      {isComparePlansOpen && (
        <div className="w-full max-w-7xl">
          <ComparePlans />
        </div>
      )}
    </div>
  );
};
export default ChoosePlan;
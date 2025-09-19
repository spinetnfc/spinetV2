import { Search } from 'lucide-react';
import React from 'react';

import useTranslate from '@/hooks/use-translate';

import CtaButton from './cta-button';
import Legend from './legend';
import { getLocale } from '@/utils/getServerLocale';


async function DiscoverMore() {
  const locale = await getLocale() || "en";
  const { t } = await useTranslate(locale);

  return (
    <div className="flex w-full flex-col items-center justify-center gap-6 px-4 py-12 lg:gap-8 lg:px-8">
      {/* Section Header */}
      <div className="flex flex-col items-center gap-4 text-center max-w-4xl mx-auto">
        <Legend text={t('one-solution-for-all')} locale={locale} />
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-spinet-deep dark:text-spinet-light">
          {t('discover-more')}
        </h2>
        <p className="text-lg sm:text-xl text-spinet-text-muted max-w-2xl">
          {t('discover-more-text')}
        </p>
      </div>

      {/* CTA Button */}
      <CtaButton
        icon={<Search className="ms-2.5 size-6" />}
        text={t('search-spinet')}
        className="max-w-[308px] w-full px-6 py-3"
        link='/search'
      />
    </div>
  );
}

export default DiscoverMore;

import { Search } from 'lucide-react';
import React from 'react';

import useTranslate from '@/hooks/use-translate';

import CtaButton from './cta-button';
import Legend from './legend';
import { getLocale } from '@/utils/getServerLocale';

 
async function DiscoverMore() {
      const locale =await getLocale() || "en";
  
  const { t } = await useTranslate(locale);
  return (
    <div className=" flex w-full flex-col items-center justify-center  gap-2.5   px-3 py-1.5  lg:gap-4">
      <Legend text={t('one-solution-for-all')} locale={locale} />
      <div className=" h-14 text-center text-4xl sm:text-5xl leading-[60px] text-[#1A3B8E] dark:text-white">
        {t('discover-more')}
      </div>

      <div className="flex  items-center justify-center text-center text-lg sm:text-xl  text-[#1A3B8E]/80  dark:text-white">
        {t('discover-more-text')}
      </div>

      <CtaButton
        icon={<Search className="ms-2.5 size-6" />}
        text={t('search-spinet')}
        className="max-w-[308px] w-full"
        link='/search'
      />
    </div>
  );
}

export default DiscoverMore;

import React from 'react';
import ChoosePlan from '@/components/pages/landing-page/choose-plan/choose-plan';
import DiscoverMore from '@/components/pages/landing-page/discover-more';
import Faq from '@/components/pages/landing-page/faq/faq';
import Features from '@/components/pages/landing-page/features/features';
import Footer from '@/components/pages/landing-page/footer/footer';
import HeroSection from '@/components/pages/landing-page/hero-section/hero-section';
import HowItWorks from '@/components/pages/landing-page/how-it-works/how-it-works';
import Products from '@/components/pages/landing-page/products/products';

import { i18n } from '../../../i18n-config';
import NavBarWrapper from '@/components/NavBarWrapper.client';

type Props = {
  // Again, params may be an object or a thenable resolving to that object.
  params: { locale: string } | Promise<{ locale: string }>;
};

async function getMessages(locale: string) {
  return (await import(`../../lang/${locale}.json`)).default;
}

const Page = async (
  { params }: {
    params: { locale: string } | Promise<{ locale: string }>;
  }) => {
  // Await params before using its properties (do not call params as a function)
  const { locale } = await params;
  const messages = await getMessages(locale);

  return (
    <>
      <NavBarWrapper locale={locale} />
      <div className="flex flex-col gap-3 overflow-x-hidden lg:gap-12">
        <HeroSection locale={locale} messages={messages} />
        <DiscoverMore locale={locale} />
        <Features locale={locale} messages={messages} />
        <ChoosePlan locale={locale} messages={messages} />
        <HowItWorks locale={locale} />
        <Products locale={locale} />
        <Faq locale={locale} messages={messages} />
        <Footer locale={locale} />
      </div>
    </>
  );
};

export default Page;

/* Homepage mob dark */
export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ locale }));
}

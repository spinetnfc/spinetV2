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

 
async function getMessages(locale: string) {
  return (await import(`../../lang/${locale}.json`)).default;
}
const Page = async (
  props: {
    params: Promise<{ locale?: string }>;
  }
) => {
  const params = await props.params;
  // Ensure locale is always a string
  const locale = params.locale ?? "en";
  const messages = await getMessages(locale);

  return (
    <>
      <NavBarWrapper  parent="home" />
      <div className="flex flex-col gap-3 overflow-x-hidden lg:gap-12">
        <section id="hero">
          <HeroSection   messages={messages} />
        </section>
        <section id="discover-more">
          <DiscoverMore />
        </section>
        <section id="features">
          <Features  messages={messages} />
        </section>
        <section id="pricing">
          <ChoosePlan    />
        </section>
        <section id="how-it-works">
          <HowItWorks locale={locale} />
        </section>
        <section id="products">
          <Products locale={locale} />
        </section>
        <section id="support">
          <Faq locale={locale} messages={messages} />
        </section>
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

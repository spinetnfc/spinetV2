'use client';
import { useState } from 'react';
import { IntlProvider } from 'react-intl';
import HeroCarousel from '@/components/pages/landing-page/hero-section/hero-carousel';
import DigitalIdentity from './digital-identity';
import EmpowerNetwork from './empower-network';
import Events from './events';
import TransformBusiness from './transform-business';
// import Image from 'next/image';
// import { useTheme } from 'next-themes';
// import { cn } from '@/utils/cn';

export default function HeroSection({
  locale,
  messages,
}: {
  locale: string;
  messages: Record<string, string>;
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // const { resolvedTheme } = useTheme();
  const slides = [
    <DigitalIdentity
      key="0"
      locale={locale}
      isMenuOpen={isMenuOpen}
      setIsMenuOpen={setIsMenuOpen}
    />,
    <EmpowerNetwork
      key="1"
      locale={locale}
      isMenuOpen={isMenuOpen}
      setIsMenuOpen={setIsMenuOpen}
    />,
    <TransformBusiness
      key="2"
      locale={locale}
      isMenuOpen={isMenuOpen}
      setIsMenuOpen={setIsMenuOpen}
    />,
    <Events
      key="3"
      locale={locale}
      isMenuOpen={isMenuOpen}
      setIsMenuOpen={setIsMenuOpen}
    />,
  ];

  return (
    <IntlProvider locale={locale} messages={messages}>
      <div className=" flex h-dvh flex-col overflow-x-hidden lg:h-screen">
        {/* <Image
          src={
            resolvedTheme === 'dark'
              ? '/img/rectangle-dark.png'
              : '/img/rectangle.png'
          }
          alt="background"
          fill
          className={cn(
            'absolute inset-0 box-border rounded-3xl dark:bg-[#01173A] dark:shadow-[0px_-1px_4px_rgba(20,95,242,0.2)]',
            locale === 'ar' && 'scale-x-[-1]',
          )}
        /> */}
        <HeroCarousel
          slides={slides}
          locale={locale}
          autoplayInterval={500000} //adjust wehn done working
          isMenuOpen={isMenuOpen}
        />
      </div>
    </IntlProvider>
  );
}

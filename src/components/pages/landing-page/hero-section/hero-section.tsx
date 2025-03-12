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
  const [activeIndex, setActiveIndex] = useState(0);

  const slides = [
    <DigitalIdentity key="0" locale={locale} isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />,
    <EmpowerNetwork key="1" locale={locale} isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />,
    <TransformBusiness key="2" locale={locale} isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} isActive={activeIndex === 2} />,
    <Events key="3" locale={locale} isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />,
  ];

  return (
    <IntlProvider locale={locale} messages={messages}>
      <div className="flex h-dvh flex-col overflow-x-hidden lg:h-screen">
        <HeroCarousel
          slides={slides}
          locale={locale}
          autoplayInterval={5000}
          isMenuOpen={isMenuOpen}
          setActiveIndex={setActiveIndex} // New prop
        />
      </div>
    </IntlProvider>
  );
}

"use client"
import enMessages from '@/lang/en.json';
import arMessages from '@/lang/ar.json';
import frMessages from '@/lang/fr.json';
import { IntlProvider } from "react-intl";
// import NavBar from '../pages/landing-page/hero-section/nav-bar';
// import { useState } from 'react';

const messagesMap = {
  en: enMessages,
  ar: arMessages,
  fr: frMessages,
};

interface ProfileLayoutProps {
  children: React.ReactNode;
  locale: string;
}

export default function ProfileLayout({ children, locale }: ProfileLayoutProps) {
  const messages = messagesMap[locale as keyof typeof messagesMap];
  // const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <IntlProvider locale={locale} messages={messages}>
      {/* <NavBar locale={locale} isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} /> */}
      {children}
    </IntlProvider>
  )
}
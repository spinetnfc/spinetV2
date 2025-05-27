"use client"
import enMessages from '@/lang/en.json';
import arMessages from '@/lang/ar.json';
import frMessages from '@/lang/fr.json';
import { IntlProvider } from "react-intl";

const messagesMap = {
  en: enMessages,
  ar: arMessages,
  fr: frMessages,
};

interface ContentLayoutProps {
  children: React.ReactNode;
  locale: string;
}

export default function ContentLayout({ children, locale }: ContentLayoutProps) {
  const messages = messagesMap[locale as keyof typeof messagesMap];
  return (
    <IntlProvider locale={locale} messages={messages}>
      {children}
    </IntlProvider>
  )
}
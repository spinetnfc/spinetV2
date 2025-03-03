"use client"
import enMessages from '@/lang/en.json';
import arMessages from '@/lang/ar.json';
import frMessages from '@/lang/fr.json';
import { FormattedMessage, IntlProvider } from "react-intl";

const messagesMap = {
    en: enMessages,
    ar: arMessages,
    fr: frMessages,
};

interface ProductsLayoutProps {
    children: React.ReactNode;
    locale: string; // Accept locale as a string prop
}

export default function ProductsLayout({ children, locale }: ProductsLayoutProps) {
    const messages = messagesMap[locale as keyof typeof messagesMap];
    return (
        <IntlProvider locale={locale} messages={messages}>
            {children}
        </IntlProvider>
    )
}
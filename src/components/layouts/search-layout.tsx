"use client"
import { ReactNode } from "react";
import NavBarWrapper from "../NavBarWrapper.client";
import enMessages from '@/lang/en.json';
import arMessages from '@/lang/ar.json';
import frMessages from '@/lang/fr.json';
import { FormattedMessage, IntlProvider } from "react-intl";

const messagesMap = {
    en: enMessages,
    ar: arMessages,
    fr: frMessages,
};
const SearchLayout = ({ locale, children }: { locale: string; children: ReactNode }) => {
    const messages = messagesMap[locale as keyof typeof messagesMap];

    return (
        <IntlProvider locale={locale} messages={messages}>
            <div className="flex flex-col min-h-screen w-full">
                <NavBarWrapper locale={locale} parent="search" />
                <div className="pt-16">
                    {children}
                </div>
            </div>
        </IntlProvider>
    );
}

export default SearchLayout;
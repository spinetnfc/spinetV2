"use client";
import { ReactNode, useEffect, useState } from "react";
import enMessages from '@/lang/en.json';
import arMessages from '@/lang/ar.json';
import frMessages from '@/lang/fr.json';
import { IntlProvider } from "react-intl";
import NavBar from "../pages/landing-page/hero-section/nav-bar";

const messagesMap = {
    en: enMessages,
    ar: arMessages,
    fr: frMessages,
};

const ProfileLayout = ({ locale, children }: { locale: string; children: ReactNode }) => {
    const messages = messagesMap[locale as keyof typeof messagesMap];

    const [isMenuOpen, setIsMenuOpen] = useState(false);


    return (
        <IntlProvider locale={locale} messages={messages}>
            <div className="w-full">
                <NavBar locale={locale} isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
                <div className="pt-10 sm:pt-0">
                    {children}
                </div>
            </div>
        </IntlProvider >
    );
};

export default ProfileLayout;

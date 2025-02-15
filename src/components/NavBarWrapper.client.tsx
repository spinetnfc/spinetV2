'use client';

import { useState } from 'react';
import { IntlProvider } from 'react-intl';
import NavBar from '@/components/pages/landing-page/hero-section/nav-bar';

import enMessages from '@/lang/en.json';
import arMessages from '@/lang/ar.json';
import frMessages from '@/lang/fr.json';

const messagesMap = {
    en: enMessages,
    ar: arMessages,
    fr: frMessages,
};

export default function NavBarWrapper({ locale }: { locale: string }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const messages = messagesMap[locale as keyof typeof messagesMap];

    return (
        <IntlProvider locale={locale} messages={messages}>
            <NavBar
                locale={locale}
                isMenuOpen={isMenuOpen}
                setIsMenuOpen={setIsMenuOpen}
                parentDarkMode={false}
            />
        </IntlProvider>
    );
}

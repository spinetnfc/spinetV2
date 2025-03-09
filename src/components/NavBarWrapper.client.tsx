'use client';

import { useState } from 'react';
import { IntlProvider } from 'react-intl';
import HomeNavBar from '@/components/pages/landing-page/hero-section/nav-bar';
import ShopNavBar from '@/components/pages/shop/nav-bar';
import SearchNavBar from '@/components/pages/search/nav-bar';
import enMessages from '@/lang/en.json';
import arMessages from '@/lang/ar.json';
import frMessages from '@/lang/fr.json';

const messagesMap = {
    en: enMessages,
    ar: arMessages,
    fr: frMessages,
};

export default function NavBarWrapper({ locale, parent }: { locale: string, parent: string }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const messages = messagesMap[locale as keyof typeof messagesMap];

    return (
        <IntlProvider locale={locale} messages={messages}>
            {parent === "home" ? <HomeNavBar
                locale={locale}
                isMenuOpen={isMenuOpen}
                setIsMenuOpen={setIsMenuOpen}
                parentDarkMode={false}
            /> : parent === "shop" ? <ShopNavBar
                locale={locale}
                isMenuOpen={isMenuOpen}
                setIsMenuOpen={setIsMenuOpen}
                parentDarkMode={false}
            /> : <SearchNavBar
                locale={locale}
                isMenuOpen={isMenuOpen}
                setIsMenuOpen={setIsMenuOpen}
                parentDarkMode={false}
            />
            }
        </IntlProvider>
    );
}

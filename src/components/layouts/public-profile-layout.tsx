"use client";
import { ReactNode, useEffect, useState } from "react";
import enMessages from '@/lang/en.json';
import arMessages from '@/lang/ar.json';
import frMessages from '@/lang/fr.json';
import { IntlProvider } from "react-intl";
import ThemeSwitch from "../theme-switch";
import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";
import NavBar from "../pages/landing-page/hero-section/nav-bar";

const messagesMap = {
    en: enMessages,
    ar: arMessages,
    fr: frMessages,
};

const ProfileLayout = ({ locale, children }: { locale: string; children: ReactNode }) => {
    const messages = messagesMap[locale as keyof typeof messagesMap];

    // Fix hydration issue by setting theme only after component mounts
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <IntlProvider locale={locale} messages={messages}>
            <div className="relative sm:pt-12">
                <div className="absolute top-0 left-0 max-w-screen w-full p-2 flex items-start justify-between bg-none z-10">
                    {/* <Link href="/" className="cursor-pointer">
                        {mounted ? (
                            <Image
                                src={resolvedTheme === "light" ? "/img/logo-spinet.svg" : "/img/logo-spinet-dark.svg"}
                                alt="logo"
                                width={160}
                                height={40}
                            />
                        ) : (
                            <Image
                                src="/img/logo-spinet.svg" // Default light mode logo to match SSR
                                alt="logo"
                                width={160}
                                height={40}
                            />
                        )}
                    </Link>
                    <ThemeSwitch locale={locale} /> */}
                    <NavBar locale={locale} isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
                </div>
                <div className="max-w-screen dark:bg-neutral-100 h-40 bg-[url('/img/spinet-banner.jpg')] bg-cover bg-center sm:hidden"></div>
                {children}
            </div>
        </IntlProvider >
    );
};

export default ProfileLayout;

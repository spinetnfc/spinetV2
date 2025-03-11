"use client"
import { ReactNode } from "react";
import enMessages from '@/lang/en.json';
import arMessages from '@/lang/ar.json';
import frMessages from '@/lang/fr.json';
import { IntlProvider } from "react-intl";
import ThemeSwitch from "../theme-switch";
import Image from "next/image";
import Link from "next/link";

const messagesMap = {
    en: enMessages,
    ar: arMessages,
    fr: frMessages,
};
const ProfileLayout = ({ locale, children }: { locale: string; children: ReactNode }) => {
    const messages = messagesMap[locale as keyof typeof messagesMap];

    return (
        <IntlProvider locale={locale} messages={messages}>
            <div className="relative sm:pt-8"> {/* Added `pt-16` to prevent margin-top issues */}
                <div className="absolute top-0 left-0 max-w-screen w-full p-2 flex items-start justify-between bg-none z-10">
                    <Link href="/" className="cursor-pointer">
                        <Image src='/img/logo-spinet-dark.svg' alt='logo' width={160} height={40} />
                    </Link>
                    <ThemeSwitch />
                </div>
                <div className="max-w-screen dark:bg-neutral-100 h-40 bg-[url('/img/spinet-banner.jpg')] bg-cover bg-center sm:hidden"></div>
                {children}
            </div>
        </IntlProvider>
    );
}

export default ProfileLayout;
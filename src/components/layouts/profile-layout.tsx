"use client"
import { ReactNode } from "react";
import enMessages from '@/lang/en.json';
import arMessages from '@/lang/ar.json';
import frMessages from '@/lang/fr.json';
import { IntlProvider } from "react-intl";
import ThemeSwitch from "../theme-switch";

const messagesMap = {
    en: enMessages,
    ar: arMessages,
    fr: frMessages,
};
const ProfileLayout = ({ locale, children }: { locale: string; children: ReactNode }) => {
    const messages = messagesMap[locale as keyof typeof messagesMap];

    return (
        <IntlProvider locale={locale} messages={messages}>
            <div>
                <div className='w-screen bg-main dark:bg-neutral-100 h-40 p-2'>
                    <ThemeSwitch />
                </div>
                {children}
            </div>
        </IntlProvider>
    );
}

export default ProfileLayout;
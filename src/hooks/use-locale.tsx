import { useParams } from "next/navigation";
import enMessages from '@/lang/en.json';
import arMessages from '@/lang/ar.json';
import frMessages from '@/lang/fr.json';

const messagesMap = {
    en: enMessages,
    ar: arMessages,
    fr: frMessages,
};
export function useLocale(): keyof typeof messagesMap {
    const params = useParams();
    return (params?.locale as "en" | "ar" | "fr") || 'en';
}

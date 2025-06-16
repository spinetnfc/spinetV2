import { useParams } from "next/navigation";

export function getLocale(): string | undefined {
    const { locale } = useParams();
    const currentLocale = typeof locale === 'string' ? locale : 'en';
    return currentLocale;
}

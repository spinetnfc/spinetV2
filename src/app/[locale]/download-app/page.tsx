import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import useTranslate from '@/hooks/use-translate';


export default async function DownloadApp({ params }: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    const { t } = await useTranslate(locale);
    return (
        <div className="fixed inset-0 p-4 flex flex-col items-center justify-center gap-8 bg-white dark:bg-[#010C32]">
            <Image src="/img/spinet-logo.svg" alt="Download App" width={80} height={80} />
            <h1 className="text-center font-medium text-lg xs:text-xl sm:text-2xl md:text-4xl text-black dark:text-white">{t("use-website-or-app")}</h1>
            <div className="flex flex-col sm:flex-row  gap-2">
                <Button className="bg-blue-600 text-base sm:text-lg text-white hover:bg-blue-600">
                    <Link
                        href="https://play.google.com/store/apps/details?id=com.spinet.spinetnfc&hl=en&pli=1"
                    >
                        {t("download-app")}
                    </Link>
                </Button>
                <Button variant="ghost" className="bg-transparent text-base sm:text-lg px-0 text-black dark:text-white hover:bg-transparent">
                    <Link
                        href="./app"
                        className="flex items-center">
                        {t("continue-on-web")}
                        <ArrowRight size={20} className={`ms-2.5 ${locale === "ar" ? "scale-x-[-1]" : ""}`} />
                    </Link>
                </Button>
            </div>
        </div>
    );
}

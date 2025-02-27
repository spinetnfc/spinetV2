import ShopButton from "./shop-button";
import { Mail } from "lucide-react";
import Footer from "../landing-page/footer/footer";
import useTranslate from "@/hooks/use-translate";

const ShopFooter = async ({ locale }: { locale: string }) => {

    const { t } = await useTranslate(locale);
    return (
        <>
            <div className="bg-background md:relative h-full md:h-32">
                <div className="md:absolute top-0 mx-2 sm:mx-5  lg:inset-x-10 2xl:inset-x-30  mb-2 md:mb-0 h-full md:h-44 bg-[#FCFCFC] border py-6 px-5 lg:px-8 rounded-3xl shadow-lg
                flex-row md:flex items-center justify-evenly space-y-2 "
                >
                    <h2 className="max-w-2xl text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-semibold text-main text-center md:text-start">
                        {t("stay-up-to-date-text")}
                    </h2>
                    <form className="flex-1 max-w-[400px] md:max-w-xl md:min-w-[400px] mx-auto md:mx-0">
                        <div className="flex gap-2 py-2 sm:py-3 px-2 lg:px-4 border rounded-xl mb-2">
                            <Mail size={24} className="text-gray-300 dark:text-gray-500 min-w-6" />
                            <input type="text" placeholder={t("enter-your-email")}
                                className="w-full placeholder:text-gray-300 dark:placeholder:text-gray-500 focus-visible:outline-hidden text-sm sm:text-md"
                            />
                        </div>
                        <ShopButton title={t("subscribe-to-newsletter")} className="py-2 sm:py-3 text-sm sm:text-md" />
                    </form>
                </div>
            </div>
            <Footer locale={locale} />
        </>
    );
}

export default ShopFooter;
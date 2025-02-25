import ShopButton from "./shop-button";
import { Mail } from "lucide-react";
import Footer from "../landing-page/footer/footer";
import useTranslate from "@/hooks/use-translate";

const ShopFooter = async ({ locale }: { locale: string }) => {

    const { t } = await useTranslate(locale);
    return (
        <>
            <div className="bg-background relative h-32">
                <div className="absolute top-0 inset-x-5 lg:inset-x-15 2xl:inset-x-30  h-44 bg-[#FCFCFC] border py-6 px-10 rounded-3xl
                flex items-center justify-evenly  "
                >
                    <h2 className="max-w-2xl text-4xl lg:text-5xl font-semibold text-main">
                        {t("stay-up-to-date-text")}
                    </h2>
                    <form className="flex-1 max-w-xl min-w-80">
                        <div className="flex gap-2 py-3 px-4 border rounded-xl mb-2">
                            <Mail size={24} className="text-gray-300 min-w-6" />
                            <input type="text" placeholder={t("enter-your-email")}
                                className="w-full placeholder:text-gray-300 focus-visible:outline-hidden "
                            />
                        </div>
                        <ShopButton title={t("subscribe-to-newsletter")} />
                    </form>
                </div>
            </div>
            <Footer locale={locale} />
        </>
    );
}

export default ShopFooter;
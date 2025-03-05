import { BrowseCategories } from "@/components/pages/shop/categories";
import { ProductsShowcase } from "@/components/pages/shop/products-showcase";
import Reviews from "@/components/pages/shop/Reviews/reviews";
import useTranslate from "@/hooks/use-translate";
import Image from "next/image";

const Shop = async ({ params }: {
    params: Promise<{ locale: string }>;
}) => {
    // Await params before using its properties (do not call params as a function)
    const { locale } = await params;
    const { t } = await useTranslate(locale);
    return (<>
        <section className="flex-col md:flex-row flex items-center justify-between m-3 xs:m-6 sm:m-8 xl:m-16 gap-4">
            <div className="lg:w-3/4 xl:w-1/2">
                <h1 className="max-w-xl text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-bold text-primary text-center md:text-start">
                    {t("customize-experience")}
                </h1>
                <p className="mt-4 text-gray-500 dark:text-gray-200 text-xs xs:text-sm sm:text-md lg:text-base">
                    {t("customize-experience-text")}
                </p>
            </div>
            <Image src="/img/shop/shop.svg" alt="NFC" width={240} height={240} />
        </section>
        <section >
            <ProductsShowcase type="new-arrivals" locale={locale} />
        </section>
        <section >
            <ProductsShowcase type="promotion" locale={locale} />
        </section>
        <section >
            <ProductsShowcase type="top-selling" locale={locale} />
        </section>
        <section className="px-3 xs:px-6 sm:px-8 xl:px-16 mb-12">
            <BrowseCategories title="BROWSE BY CATEGORY" locale={locale} />
        </section>
        <section>
            <Reviews />
        </section>
    </>
    );
}

export default Shop;
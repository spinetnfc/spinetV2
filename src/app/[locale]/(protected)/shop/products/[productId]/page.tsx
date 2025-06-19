import { notFound } from "next/navigation";
import { Suspense } from "react";
import ProductTabs from "@/components/pages/shop/products/product-tabs";
import ProductOrderForm from "@/components/pages/shop/products/order-product-form";
import RelatedProductsCarousel from "@/components/pages/shop/products/related-products";
import ProductImageViewer from "@/components/pages/shop/products/product-images";
import useTranslate from '@/hooks/use-translate';
import { getProductById, getRelatedProducts } from "@/mockdata/product";

type ProductDetailsPageProps = {
    params: Promise<{ productId: string; locale: string }>;
};

export default async function ProductDetailsPage({ params }: ProductDetailsPageProps) {
    const { productId, locale } = await params;
    const { t } = await useTranslate(locale);
    const product = getProductById(productId);
    if (!product) {
        return notFound();
    }

    const related = getRelatedProducts(productId);

    return (
        <div className="mx-5 sm:mx-8 lg:mx-10 min-h-screen py-6">
            {/* Breadcrumbs */}
            <nav className="mb-4 text-sm text-gray-600 dark:text-gray-300">
                <ol className="flex items-center space-x-2">
                    <li>
                        <a href={`/${locale}`} className="hover:underline">
                            {t("home")}
                        </a>
                    </li>
                    <li>{">"}</li>
                    <li>
                        <a href={`/${locale}/shop`} className="hover:underline">
                            {t("shop")}
                        </a>
                    </li>
                    <li>{">"}</li>
                    <li className="font-semibold text-gray-900 dark:text-white">{product.name}</li>
                </ol>
            </nav>

            {/* Main Section: Images & Info */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:flex ">
                {/*Product Images */}
                <div>
                    <ProductImageViewer
                        images={product.images}
                        productName={product.name}
                    />
                </div>

                {/*Product Details */}
                <div className="flex flex-col space-y-4 ">
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{product.name}</h1>
                    <div className="flex items-center">
                        <span className="text-yellow-500">
                            {"★".repeat(Math.round(product.rating))}
                        </span>
                        <span className="ms-1 text-gray-600 dark:text-gray-300">{product.rating}/5</span>
                    </div>
                    <div className="flex items-start gap-1">
                        <p className="text-3xl font-semibold text-blue-600">{product.price}</p>
                        <p className="text-xs text-blue-600">{t("da")}</p>
                    </div>
                    <p className="text-gray-700 dark:text-gray-200">{product.description}</p>
                    <ProductOrderForm product={product} />
                </div>
            </div>

            {/* Tabs Section: Product Details & Rating/Reviews */}
            <div className="mt-8">
                <Suspense fallback={<div>{t("loading-tabs")}...</div>}>
                    <ProductTabs details={product.details} locale={locale} />
                </Suspense>
            </div>

            {/* Related Products Carousel */}
            <RelatedProductsCarousel products={related} locale={locale} />
        </div>
    );
}
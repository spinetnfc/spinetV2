"use client"
import Link from "next/link"
import { MOCK_PRODUCTS } from "@/mockdata/products"
import ProductCard from "./products/product-card"
import { FormattedMessage, IntlProvider } from "react-intl"
import enMessages from '@/lang/en.json';
import arMessages from '@/lang/ar.json';
import frMessages from '@/lang/fr.json';

const messagesMap = {
    en: enMessages,
    ar: arMessages,
    fr: frMessages,
};

interface ProductsShowcaseProps {
    type: "new-arrivals" | "promotion" | "top-selling"
    locale: string
}

export function ProductsShowcase({ type, locale }: ProductsShowcaseProps) {
    // Filter products by type and get first 4
    const products = MOCK_PRODUCTS.filter((product) => product.type === type).slice(0, 4)
    const messages = messagesMap[locale as keyof typeof messagesMap];

    return (
        <IntlProvider locale={locale} messages={messages}>
            <div className="mx-3 xs:mx-6 sm:mx-8 xl:mx-16 mt-8">
                <h2 className="text-center text-5xl font-semibold text-primary mb-8">
                    {<FormattedMessage id={type} />}
                </h2>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} locale={locale} />
                    ))}
                </div>

                <div className="text-center">
                    <Link
                        href={`/shop/products?category=${type}`}
                        className="inline-block px-6 py-2 border-2 border-primary text-primary rounded-md hover:bg-primary hover:text-white transition-colors"
                    >
                        View All
                    </Link>
                </div>
            </div>
        </IntlProvider>
    )
}


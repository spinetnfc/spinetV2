import Image from "next/image";
import { notFound } from "next/navigation";
import { getProductById, getRelatedProducts } from "@/mockdata/product";
import { Suspense } from "react";
import ProductTabs from "@/components/pages/shop/products/product-tabs";
import imgUrl from "@/mockdata/keychain.png";
import ProductOrderForm from "@/components/pages/shop/products/order-product-form";

type ProductDetailsPageProps = {
    params: Promise<{ productId: string; locale: string }>;
};

export default async function ProductDetailsPage({ params }: ProductDetailsPageProps) {
    const { productId, locale } = await params;

    const product = getProductById(productId);
    if (!product) {
        return notFound();
    }

    const related = getRelatedProducts(productId);

    return (
        <div className="mx-auto w-full min-h-screen max-w-6xl px-4 py-6">
            <nav className="mb-4 text-sm text-gray-600 dark:text-gray-300">
                <ol className="flex items-center space-x-2">
                    <li>
                        <a href={`/${locale}`} className="hover:underline">
                            Home
                        </a>
                    </li>
                    <li>{">"}</li>
                    <li>
                        <a href={`/${locale}/shop`} className="hover:underline">
                            Shop
                        </a>
                    </li>
                    <li>{">"}</li>
                    <li className="font-semibold text-gray-900 dark:text-white">
                        {product.name}
                    </li>
                </ol>
            </nav>

            {/* Main Section: Image & Info */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Product Image */}
                <div className="flex items-center justify-center">
                    <Image
                        src={imgUrl}
                        alt={product.name}
                        width={300}
                        height={300}
                        className="object-contain"
                    />
                </div>

                {/* Product Details */}
                <div className="flex flex-col space-y-4">
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                        {product.name}
                    </h1>

                    {/* Simple star rating example */}
                    <div className="flex items-center">
                        <span className="text-yellow-500">
                            {"★".repeat(Math.round(product.rating))}
                        </span>
                        <span className="ml-1 text-gray-600 dark:text-gray-300">
                            {product.rating}/5
                        </span>
                    </div>

                    {/* Price */}
                    <div className="flex items-start gap-1">
                        <p className="text-3xl font-semibold text-blue-600">
                            {product.price}
                        </p>
                        <p className="text-xs text-blue-600">DA</p>
                    </div>

                    {/* Short description */}
                    <p className="text-gray-700 dark:text-gray-200">
                        {product.description}
                    </p>

                    {/* NEW: Order Form (color, size, quantity, button) */}
                    <ProductOrderForm product={product} />
                </div>
            </div>

            {/* Tabs Section: Product Details & Rating/Reviews */}
            <div className="mt-8">
                <Suspense fallback={<div>Loading Tabs...</div>}>
                    <ProductTabs details={product.details} />
                </Suspense>
            </div>

            {/* You Might Also Like */}
            <div className="mt-10">
                <h2 className="mb-4 text-xl font-semibold text-gray-800 dark:text-gray-100">
                    You Might Also Like
                </h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {related.map((rel) => (
                        <div key={rel.id} className="flex flex-col rounded-md border p-4">
                            <Image
                                src={rel.image}
                                alt={rel.name}
                                width={200}
                                height={200}
                                className="mb-2 h-48 w-full object-cover"
                            />
                            <p className="font-medium text-gray-700 dark:text-gray-200">
                                {rel.name}
                            </p>
                            <p className="text-blue-600">{rel.price} DA</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

import Image from "next/image";
import { notFound } from "next/navigation";
import { getProductById, getRelatedProducts } from "@/mockdata/product";
import { Suspense } from "react";
import ProductTabs from '@/components/pages/shop/products/product-tabs';
import imgUrl from "@/mockdata/keychain.png";

type ProductDetailsPageProps = {
    // Change 'prodId' to 'productId' to match the folder name and the URL segment
    params: Promise<{ productId: string; locale: string }>;
};

export default async function ProductDetailsPage({ params }: ProductDetailsPageProps) {
    // Await the params and destructure the correct properties
    const { productId, locale } = await params;

    // In a real app, fetch from DB or API
    const product = getProductById(productId);
    if (!product) {
        // If product not found, return notFound()
        return notFound();
    }

    const related = getRelatedProducts(productId);

    return (
        <div className="mx-auto w-full min-h-screen max-w-6xl px-4 py-6">
            {/* Breadcrumbs */}
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

                    {/* Price & Rating */}
                    <div className="flex items-center space-x-4">
                        <p className="text-3xl font-semibold text-blue-600">
                            {product.price} DA
                        </p>
                        <div className="flex items-center">
                            {/* Simple star rating example */}
                            <span className="text-yellow-500">
                                {"★".repeat(Math.round(product.rating))}
                            </span>
                            <span className="ml-1 text-gray-600 dark:text-gray-300">
                                {product.rating}/5
                            </span>
                        </div>
                    </div>

                    {/* Short description */}
                    <p className="text-gray-700 dark:text-gray-200">
                        {product.description}
                    </p>

                    {/* Select Colors */}
                    <div>
                        <label className="block font-medium text-gray-800 dark:text-gray-200 mb-1">
                            Select Colors
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {product.colors.map((color) => (
                                <button
                                    key={color}
                                    className="rounded-md border px-3 py-1 text-sm text-gray-600 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                                >
                                    {color}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Choose Size */}
                    <div>
                        <label className="block font-medium text-gray-800 dark:text-gray-200 mb-1">
                            Choose Size
                        </label>
                        <select className="w-full rounded-md border px-3 py-2 text-gray-700 dark:bg-gray-800 dark:text-gray-200">
                            <option value="">Select</option>
                            {product.sizes.map((size) => (
                                <option key={size} value={size}>
                                    {size}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Sign in to buy */}
                    <button className="mt-2 w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
                        Sign in to buy
                    </button>
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

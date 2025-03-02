import Image from "next/image";
import { notFound } from "next/navigation";
import { getProductById, getRelatedProducts } from "@/mockdata/product";
import { Suspense } from "react";
import ProductTabs from "@/components/pages/shop/products/product-tabs";
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
        <div className="mx-2 sm:mx-5 lg:mx-20 min-h-screen px-4 py-6">
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
                    <li className="font-semibold text-gray-900 dark:text-white">{product.name}</li>
                </ol>
            </nav>

            {/* Main Section: Images & Info */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* LEFT: Single or Multiple Images */}
                <div>
                    {product.images.length === 1 ? (
                        /* If only one image, show it big (original behavior) */
                        <div className="flex items-center justify-center">
                            <Image
                                src={product.images[0]}
                                alt={product.name}
                                width={360}
                                height={360}
                                className="object-contain border-2 border-blue-500 rounded-2xl"
                            />
                        </div>
                    ) : (
                        /* Multiple images layout: left side for thumbnails, right side for big image */
                        <div className="flex flex-col-reverse lg:flex-row gap-4 justify-center items-center">
                            {/* Thumbnails on the left */}
                            <div className="flex flex-row lg:flex-col gap-4">
                                {renderSmallImages(product.images.slice(1))}
                            </div>
                            {/* Big image (the first one) */}
                            <div className="flex items-center justify-center">
                                <Image
                                    src={product.images[0]}
                                    alt={product.name}
                                    width={360}
                                    height={360}
                                    className="object-contain border-2 border-blue-500 rounded-2xl"
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* RIGHT: Product Details */}
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
                        <p className="text-3xl font-semibold text-blue-600">{product.price}</p>
                        <p className="text-xs text-blue-600">DA</p>
                    </div>

                    {/* Short description */}
                    <p className="text-gray-700 dark:text-gray-200">{product.description}</p>

                    {/* Order Form (colors, sizes, quantity, etc.) */}
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
                                src={rel.images[0]}
                                alt={rel.name}
                                width={200}
                                height={200}
                                className="mb-2 h-48 w-full object-cover"
                            />
                            <p className="font-medium text-gray-700 dark:text-gray-200">{rel.name}</p>
                            <p className="text-blue-600">{rel.price} DA</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

/**
 * Helper function to render small images.
 * If there are 3 or fewer images, show them all.
 * If more than 3, show only 3 thumbnails:
 *   - The first two are shown normally.
 *   - The third is overlaid with dark opacity and displays "+X" for the remaining count.
 */
function renderSmallImages(smallImages: string[]) {
    if (smallImages.length <= 3) {
        return smallImages.map((img, index) => (
            <Image
                key={index}
                src={img}
                alt="Thumbnail"
                width={60}
                height={60}
                className="w-24 xs:h-28 xs:w-28 object-cover border-2 border-blue-500  cursor-pointer rounded-xl"
            />
        ));
    } else {
        const firstTwo = smallImages.slice(0, 2);
        const thirdImage = smallImages[2];
        const remaining = smallImages.length - 2;
        return (
            <>
                {firstTwo.map((img, index) => (
                    <Image
                        key={index}
                        src={img}
                        alt="Thumbnail"
                        width={60}
                        height={60}
                        className="w-3/10 xs:h-28 xs:w-28 object-cover border-2 border-blue-500  cursor-pointer rounded-xl"
                    />
                ))}
                {/* Third thumbnail with dark overlay showing remaining count */}
                <div className="relative w-3/10 xs:h-28 xs:w-28 cursor-pointer border-2 border-blue-500 rounded-xl overflow-hidden">
                    <Image
                        src={thirdImage}
                        alt="Thumbnail"
                        width={60}
                        height={60}
                        className="w-3/10 xs:h-28 xs:w-28 object-cover rounded-xl"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black opacity-60">
                        <span className="text-sm text-white">+{remaining}</span>
                    </div>
                </div>
            </>
        );
    }
}

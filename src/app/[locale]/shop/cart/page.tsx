"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Trash } from "lucide-react";
import QuantitySelector from "@/components/ui/quantity-selector";
import ShopButton from "@/components/pages/shop/shop-button";

// Mock data for demonstration
const INITIAL_CART = [
    {
        id: 1,
        name: "Spinet keychain",
        price: 2500,
        size: "Large",
        color: "White",
        quantity: 1,
        image:
            "data:image/jpeg;base64,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",
    },
    {
        id: 2,
        name: "Spinet keychain",
        price: 2500,
        size: "Large",
        color: "White",
        quantity: 2,
        image:
            "data:image/jpeg;base64,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",
    },
    {
        id: 3,
        name: "Spinet keychain",
        price: 2500,
        size: "Large",
        color: "White",
        quantity: 1,
        image:
            "data:image/jpeg;base64,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",
    },
];

// Calculate totals (normally you might do this on the server)
function calculateCartSummary(cart: typeof INITIAL_CART) {
    const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const discount = 100; // Example discount
    const deliveryFee = 0; // Example shipping
    const total = subtotal - discount + deliveryFee;
    return { subtotal, discount, deliveryFee, total };
}

export default function CartPage() {
    // We keep cart in local state for this demo
    const [cart, setCart] = useState(INITIAL_CART);

    // Recompute totals each render
    const { subtotal, discount, deliveryFee, total } = calculateCartSummary(cart);

    // Delete item by filtering it out of cart
    const removeItem = (id: number) => {
        setCart((prevCart) => prevCart.filter((item) => item.id !== id));
    };

    const isCartEmpty = cart.length === 0;

    return (
        <div className="px-4 py-6 md:py-10">
            {/* Breadcrumbs */}
            <nav className="mb-6 text-sm text-gray-600 dark:text-gray-300">
                <ol className="flex items-center space-x-2">
                    <li>
                        <Link href="/" className="hover:underline">
                            Home
                        </Link>
                    </li>
                    <li>{">"}</li>
                    <li>
                        <Link href="/shop" className="hover:underline">
                            Shop
                        </Link>
                    </li>
                    <li>{">"}</li>
                    <li className="font-semibold text-gray-900 dark:text-white">Cart</li>
                </ol>
            </nav>

            <h1 className="mb-6 text-2xl sm:text-4xl font-bold">Your cart</h1>

            {isCartEmpty ? (
                // If cart is empty, display a message and a button to go back shopping
                <div className="flex flex-col items-center justify-center gap-4 py-10">
                    <p className="text-lg text-gray-700 dark:text-gray-200">
                        Your cart is currently empty.
                    </p>
                    <ShopButton title="Continue Shopping" className="px-6 py-2" />
                </div>
            ) : (
                // If cart has items, display the cart layout
                <div className="grid grid-cols-1 space-y-6 md:space-y-0 md:gap-6 md:grid-cols-3">
                    {/* Cart Items */}
                    <div className="col-span-2 rounded-lg border px-2 xs:px-4">
                        {cart.map((item) => (
                            <div
                                key={item.id}
                                className="relative flex gap-1 xs:gap-4 p-2 sm:p-4 border-b"
                            >
                                {/* Delete icon in top-right corner */}
                                <button
                                    onClick={() => removeItem(item.id)}
                                    className="absolute top-2 right-2 text-red-500 hover:scale-110"
                                    aria-label="Delete item"
                                >
                                    <Trash size={16} />
                                </button>

                                {/* Image (independent) */}
                                <div className="relative h-14 xs:h-16 lg:h-20 w-14 xs:w-16 lg:w-20 flex-shrink-0 rounded-lg overflow-hidden">
                                    <Image src={item.image} alt={item.name} fill className="object-contain" />
                                </div>

                                {/* Two rows on the right */}
                                <div className="flex flex-1 flex-col justify-between">
                                    {/* Row 1: Name, size, color */}
                                    <div>
                                        <h3 className="text-sm xs:text-base font-semibold text-gray-800 dark:text-gray-200">
                                            {item.name}
                                        </h3>
                                        <p className="text-xs xs:text-sm text-gray-500 dark:text-gray-400">
                                            Size: {item.size} &nbsp; | &nbsp; Color: {item.color}
                                        </p>
                                    </div>

                                    {/* Row 2: Price + Quantity */}
                                    <div className="flex items-center justify-between">
                                        <p className="text-base xs:text-lg font-semibold text-gray-700 dark:text-gray-200">
                                            {item.price * item.quantity} DA
                                        </p>
                                        <QuantitySelector initialQuantity={item.quantity} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div className="col-span-1 h-fit rounded-lg border p-2 sm:p-4 lg:p-6">
                        <h2 className="mb-4 text-lg font-semibold">Order Summary</h2>
                        <div className="mb-2 flex items-center justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-300">Subtotal</span>
                            <span className="font-medium">{subtotal} DA</span>
                        </div>
                        <div className="mb-2 flex items-center justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-300">Discount</span>
                            <span className="font-medium text-red-500">-{discount} DA</span>
                        </div>
                        <div className="mb-2 flex items-center justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-300">Delivery Fee</span>
                            <span className="font-medium">{deliveryFee} DA</span>
                        </div>
                        <hr className="my-2" />
                        <div className="mb-4 flex items-center justify-between">
                            <span className="font-semibold">Total</span>
                            <span className="font-bold text-blue-600">{total} DA</span>
                        </div>
                        <ShopButton title="Go to Checkout" className="w-full" />
                    </div>
                </div>
            )}
        </div>
    );
}

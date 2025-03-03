"use client";

import { useState } from "react";
import { Product } from "@/mockdata/product";
import QuantitySelector from "@/components/ui/quantity-selector";
import { Form } from "react-hook-form";
import { FormattedMessage } from "react-intl";

interface ProductOrderFormProps {
    product: Product;
}

export default function ProductOrderForm({ product }: ProductOrderFormProps) {
    // Default to first color/size if available
    const [selectedColor, setSelectedColor] = useState<string | null>(
        product.colors[0] || null
    );
    const [selectedSize, setSelectedSize] = useState<string | null>(
        product.sizes[0] || null
    );

    // If you want to track quantity changes at the form level, you can do:
    // const [quantity, setQuantity] = useState(1);

    return (
        <form className="space-y-4">
            {/* Select Colors */}
            <div>
                <label className="block font-medium text-gray-800 dark:text-gray-200 mb-1">
                    <FormattedMessage id="choose-color" />
                </label>
                <div className="flex items-center gap-3">
                    {product.colors.map((color) => {
                        const isSelected = selectedColor === color;
                        return (
                            <button
                                type="button"
                                key={color}
                                onClick={() => setSelectedColor(color)}
                                className={`flex h-8 w-8 items-center justify-center rounded-full border ${isSelected
                                    ? "ring-2 ring-offset-1 ring-blue-500"
                                    : "border-gray-300"
                                    }`}
                                style={{ backgroundColor: color }}
                            >
                                {isSelected && <span className="text-white">✓</span>}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Choose Size */}
            <div>
                <label className="block font-medium text-gray-800 dark:text-gray-200 mb-1">
                    <FormattedMessage id="choose-size" />
                </label>
                <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => {
                        const isSelected = selectedSize === size;
                        return (
                            <button
                                type="button"
                                key={size}
                                onClick={() => setSelectedSize(size)}
                                className={`px-4 py-2 rounded-full text-sm ${isSelected
                                    ? "bg-blue-500 text-white"
                                    : "text-gray-600 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-blue-900"
                                    }`}
                            >
                                {size}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="flex justify-start gap-2">
                {/* Use our separate QuantitySelector */}
                <QuantitySelector
                    initialQuantity={1}
                // onChange={(val) => setQuantity(val)} // optional if you want to store in parent
                />

                <button
                    type="submit"
                    className="w-fit sm:w-40 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                >
                    <FormattedMessage id="add-to-cart" />
                </button>
            </div>
        </form>
    );
}

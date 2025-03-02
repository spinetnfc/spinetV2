"use client";

import { useState } from "react";
import { Product } from "@/mockdata/product";
import { Minus, Plus } from "lucide-react";

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
    const [quantity, setQuantity] = useState<number>(1);

    const handleIncrement = () => setQuantity((q) => q + 1);
    const handleDecrement = () => setQuantity((q) => Math.max(1, q - 1));

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value === "") {
            setQuantity(1);
            return;
        }
        const parsed = parseInt(value, 10);
        if (isNaN(parsed) || parsed <= 0) {
            setQuantity(1);
        } else {
            setQuantity(parsed);
        }
    };

    return (
        <form className="space-y-4">
            {/* Select Colors */}
            <div>
                <label className="block font-medium text-gray-800 dark:text-gray-200 mb-1">
                    Select Colors
                </label>
                <div className="flex items-center gap-3">
                    {product.colors.map((color) => {
                        const isSelected = selectedColor === color;
                        return (
                            <button
                                type="button"
                                key={color}
                                onClick={() => setSelectedColor(color)}
                                className={`flex h-8 w-8 items-center justify-center rounded-full border ${isSelected ? "ring-2 ring-offset-1 ring-blue-500" : "border-gray-300"
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
                    Choose Size
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
                                    : "border border-gray-300 text-gray-600 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-blue-900"
                                    }`}
                            >
                                {size}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="flex items-center justify-center gap-2">

                {/* Quantity */}
                <div className="flex items-center gap-2 px-4 py-2 bg-gray-200 w-fit rounded-sm">
                    <button
                        type="button"
                        onClick={handleDecrement}
                        className="rounded-lg text-xl leading-none hover:scale-110 cursor-pointer text-blue-950"
                    >
                        <Minus size={16} />
                    </button>
                    <input
                        type="number"
                        value={quantity}
                        onChange={handleChange}
                        min={1}
                        // Dynamic width: using ch units, minimum width is 2ch
                        style={{ width: `${Math.max(quantity.toString().length, 2)}ch` }}
                        className="appearance-none text-center text-blue-950 bg-transparent border-none focus:outline-none"
                    />
                    <button
                        type="button"
                        onClick={handleIncrement}
                        className="rounded-lg text-xl leading-none hover:scale-110 cursor-pointer text-blue-950"
                    >
                        <Plus size={16} />
                    </button>
                </div>

                <button
                    type="submit"
                    className="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                >
                    Sign in to buy
                </button>
            </div>

            {/* Global styles to remove default spinner buttons */}
            <style jsx global>{`
        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type="number"] {
          -moz-appearance: textfield;
        }
      `}</style>
        </form>
    );
}

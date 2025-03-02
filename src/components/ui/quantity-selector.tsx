"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";

interface QuantitySelectorProps {
    initialQuantity?: number;
    onChange?: (value: number) => void;
}

export default function QuantitySelector({
    initialQuantity = 1,
    onChange,
}: QuantitySelectorProps) {
    const [quantity, setQuantity] = useState(initialQuantity);

    // Increment
    const handleIncrement = () => {
        setQuantity((q) => {
            const newQ = q + 1;
            onChange?.(newQ);
            return newQ;
        });
    };

    // Decrement, but never below 1
    const handleDecrement = () => {
        setQuantity((q) => {
            const newQ = Math.max(1, q - 1);
            onChange?.(newQ);
            return newQ;
        });
    };

    // Handle manual changes in the <input type="number" />
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value === "") {
            setQuantity(1);
            onChange?.(1);
            return;
        }
        const parsed = parseInt(value, 10);
        if (isNaN(parsed) || parsed <= 0) {
            setQuantity(1);
            onChange?.(1);
        } else {
            setQuantity(parsed);
            onChange?.(parsed);
        }
    };

    return (
        <div className="flex items-center gap-2 px-1.5 xs:px-4 py-1 xs:py-2 bg-gray-200 dark:bg-navy w-fit rounded-sm">
            <button
                type="button"
                onClick={handleDecrement}
                className="rounded-lg leading-none hover:scale-110 cursor-pointer text-navy dark:text-gray-200"
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
                className="appearance-none text-center text-navy dark:text-gray-200 bg-transparent border-none focus:outline-none"
            />
            <button
                type="button"
                onClick={handleIncrement}
                className="rounded-lg leading-none hover:scale-110 cursor-pointer text-navy dark:text-gray-200"
            >
                <Plus size={16} />
            </button>
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
        </div>
    );
}

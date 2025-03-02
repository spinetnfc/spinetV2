"use client";

import React, { useRef, useEffect } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Image from "next/image";
import useDrag from "@/hooks/use-horizontal-drag";
import { Product } from "@/mockdata/product";

interface RelatedProductsCarouselProps {
    products: Product[];
}

export default function RelatedProductsCarousel({ products }: RelatedProductsCarouselProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    // Use our custom drag hook (with a fallback if undefined)
    const [
        handleMouseDown,
        handleMouseLeave,
        handleMouseUp,
        handleMouseMove,
        handleWheel,
    ] = useDrag?.(containerRef) || [];

    useEffect(() => {
        const container = containerRef.current;
        if (container && handleWheel) {
            container.addEventListener("wheel", handleWheel, {
                passive: false, // allow preventDefault to stop vertical scrolling
            });
        }
        return () => {
            if (container && handleWheel) {
                container.removeEventListener("wheel", handleWheel);
            }
        };
    }, [handleWheel]);

    const scrollLeft = () => {
        if (containerRef.current) {
            containerRef.current.scrollTo({
                left: containerRef.current.scrollLeft - 316,
                behavior: "smooth",
            });
        }
    };

    const scrollRight = () => {
        if (containerRef.current) {
            containerRef.current.scrollTo({
                left: containerRef.current.scrollLeft + 316,
                behavior: "smooth",
            });
        }
    };

    return (
        <section className="py-8 w-full">
            <div className="flex justify-between items-center p-2 xs:p-4 sm:p-8">
                <h2 className="text-3xl font-bold text-[#010E37] dark:text-[#DEE3F8]">
                    You Might Also Like
                </h2>
                <div className="flex justify-center gap-4">
                    <button onClick={scrollLeft} className="cursor-pointer" aria-label="Scroll left">
                        <ArrowLeft />
                    </button>
                    <button onClick={scrollRight} className="cursor-pointer" aria-label="Scroll right">
                        <ArrowRight />
                    </button>
                </div>
            </div>
            <div
                ref={containerRef}
                className="no-scrollbar flex cursor-grab items-stretch gap-4 px-4 overflow-x-auto active:cursor-grabbing"
                onMouseDown={handleMouseDown}
                onMouseLeave={handleMouseLeave}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
            >
                {products.map((product) => (
                    <div key={product.id} className="flex flex-col rounded-md border p-4 min-w-[200px]">
                        <Image
                            src={product.images[0]}
                            alt={product.name}
                            width={200}
                            height={200}
                            className="mb-2 h-48 w-full object-cover"
                        />
                        <p className="font-medium text-gray-700 dark:text-gray-200">{product.name}</p>
                        <p className="text-blue-600">{product.price} DA</p>
                    </div>
                ))}
            </div>
        </section>
    );
}

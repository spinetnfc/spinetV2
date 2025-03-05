// components/pages/shop/products/ImageModal.tsx
'use client';

import React, { useState, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import useEmblaCarousel from "embla-carousel-react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

interface ImageModalProps {
    images: string[];
    initialIndex: number;
    onClose: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({ images, initialIndex, onClose }) => {
    const [isMounted, setIsMounted] = useState(false);
    const [emblaRef, emblaApi] = useEmblaCarousel({
        startIndex: initialIndex,
        loop: true,
    });

    // Only run client-side
    useEffect(() => {
        setIsMounted(true);

        // Add event listener to close modal on escape key
        const handleEscapeKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEscapeKey);

        return () => {
            document.removeEventListener('keydown', handleEscapeKey);
        };
    }, [onClose]);

    const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
    const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

    if (!isMounted) return null;

    return createPortal(
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
            onClick={onClose}
        >
            <div
                className="relative w-screen h-screen px-4"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-white z-10 hover:bg-gray-800 rounded-full"
                    aria-label="Close"
                >
                    <X size={32} />
                </button>

                <div className="overflow-hidden mt-20" ref={emblaRef}>
                    <div className="flex ">
                        {images.map((src, index) => (
                            <div key={index} className="flex-shrink-0 w-full flex justify-center items-center h-[80vh]">
                                <Image
                                    src={src}
                                    alt={`Image ${index + 1}`}
                                    width={800}
                                    height={800}
                                    className="max-h-full max-w-full object-contain"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                <button
                    onClick={scrollPrev}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white bg-black/50 p-2 rounded-full hover:bg-black/70 hidden sm:block"
                    aria-label="Previous image"
                >
                    <ChevronLeft size={32} />
                </button>

                <button
                    onClick={scrollNext}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white bg-black/50 p-2 rounded-full hover:bg-black/70 hidden sm:block"
                    aria-label="Next image"
                >
                    <ChevronRight size={32} />
                </button>
            </div>
        </div>,
        document.body
    );
};

export default ImageModal;
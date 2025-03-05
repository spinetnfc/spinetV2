// components/pages/shop/products/ProductImageViewer.tsx
'use client';

import React, { useState } from "react";
import Image from "next/image";
import ImageModal from "@/components/image-modal";

interface ProductImageViewerProps {
    images: string[];
    productName: string;
}

export default function ProductImageViewer({ images, productName }: ProductImageViewerProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [initialIndex, setInitialIndex] = useState(0);

    const openModal = (index: number) => {
        setInitialIndex(index);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    // Handle single image case
    if (images.length === 1) {
        return (
            <div className="flex items-center justify-end">
                <Image
                    src={images[0]}
                    alt={productName}
                    width={360}
                    height={360}
                    className="flex-1 max-w-md object-contain border-2 border-blue-500 rounded-2xl cursor-pointer"
                    onClick={() => openModal(0)}
                />
                {isModalOpen && (
                    <ImageModal
                        images={images}
                        initialIndex={initialIndex}
                        onClose={closeModal}
                    />
                )}
            </div>
        );
    }

    // Handle multiple images case
    return (
        <div className="flex flex-col-reverse lg:flex-row gap-2 lg:gap-3 justify-end items-center">
            {/* Thumbnails on the left */}
            <div className="flex flex-row lg:flex-col gap-2 lg:gap-3">
                {renderThumbnails(images.slice(1), (index) => openModal(index + 1))}
            </div>

            {/* Main image */}
            <div className="flex items-center justify-center">
                <Image
                    src={images[0]}
                    alt={productName}
                    width={360}
                    height={360}
                    className="lg:min-w-[360px] object-contain border-2 border-blue-500 rounded-2xl cursor-pointer"
                    onClick={() => openModal(0)}
                />
            </div>

            {isModalOpen && (
                <ImageModal
                    images={images}
                    initialIndex={initialIndex}
                    onClose={closeModal}
                />
            )}
        </div>
    );
}

// Helper function to render thumbnails
function renderThumbnails(smallImages: string[], onImageClick: (index: number) => void) {
    // Common thumbnail class for consistency
    const thumbnailClass = "w-24 xs:w-28 object-cover cursor-pointer";

    if (smallImages.length <= 3) {
        return smallImages.map((img, index) => (
            <div
                key={index}
                className="border-2 border-blue-500 rounded-xl overflow-hidden"
                onClick={() => onImageClick(index)}
            >
                <Image
                    src={img}
                    alt="Thumbnail"
                    width={60}
                    height={60}
                    className={thumbnailClass}
                />
            </div>
        ));
    } else {
        const firstTwo = smallImages.slice(0, 2);
        const thirdImage = smallImages[2];
        const remaining = smallImages.length - 2;

        return (
            <>
                {firstTwo.map((img, index) => (
                    <div
                        key={index}
                        className="border-2 border-blue-500 rounded-xl overflow-hidden"
                        onClick={() => onImageClick(index)}
                    >
                        <Image
                            src={img}
                            alt="Thumbnail"
                            width={60}
                            height={60}
                            className={thumbnailClass}
                        />
                    </div>
                ))}
                {/* Third thumbnail with dark overlay showing remaining count */}
                <div
                    className="relative border-2 border-blue-500 rounded-xl overflow-hidden cursor-pointer"
                    onClick={() => onImageClick(2)}
                >
                    <Image
                        src={thirdImage}
                        alt="Thumbnail"
                        width={60}
                        height={60}
                        className={thumbnailClass}
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/80">
                        <span className="text-sm text-white">+{remaining}</span>
                    </div>
                </div>
            </>
        );
    }
}
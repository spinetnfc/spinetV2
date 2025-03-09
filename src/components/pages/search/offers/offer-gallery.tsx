"use client"

import { useState } from "react"
import Image from "next/image"
import { Play } from "lucide-react"

interface OfferGalleryProps {
    images: string[]
    videoUrl: string
}

export function OfferGallery({ images, videoUrl }: OfferGalleryProps) {
    const [selectedImage, setSelectedImage] = useState<string | null>(null)

    return (
        <div className="xs:container mb-12">
            {/* Main display */}
            <div className="relative aspect-video mb-4 rounded-lg overflow-hidden">
                {selectedImage ? (
                    <Image
                        src={selectedImage || "/placeholder.svg"}
                        alt="Selected preview"
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                ) : (
                    <div className="relative h-full bg-black/50">
                        <Image
                            src={images[0] || "/placeholder.svg"}
                            alt="Video thumbnail"
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                        <button className="absolute inset-0 flex items-center justify-center">
                            <div className="h-16 w-16 rounded-full bg-white/20 flex items-center justify-center">
                                <Play className="h-8 w-8 text-white" />
                            </div>
                        </button>
                    </div>
                )}
            </div>

            {/* Thumbnails */}
            <div className="grid grid-cols-3 gap-4">
                {images.map((image, index) => (
                    <button
                        key={index}
                        onClick={() => setSelectedImage(image)}
                        className="relative aspect-video rounded-lg overflow-hidden hover:opacity-90 transition-opacity"
                    >
                        <Image
                            src={image || "/placeholder.svg"}
                            alt={`Preview ${index + 1}`}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 33vw, 20vw"
                        />
                    </button>
                ))}
            </div>
        </div>
    )
}


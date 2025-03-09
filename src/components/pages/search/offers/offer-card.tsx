"use client"

import Image from "next/image"
import { Heart, Eye } from "lucide-react"
import Link from "next/link"

interface OfferCardHorizontalProps {
    offer: {
        id: number
        title: string
        description: string
        mainImage: string
        thumbnails?: string[]
        stats: {
            likes: number
            views: number
        }
    }
    author: {
        id: string
        name: string
        image: string
    }
}

export function OfferCard({ offer, author }: OfferCardHorizontalProps) {
    return (
        <div className="bg-[#0A1F44]/50 rounded-lg overflow-hidden">
            <div className="relative">
                {/* Main image */}
                <div className="relative aspect-[4/3] w-full">
                    <Image
                        src={offer.mainImage || "/placeholder.svg"}
                        alt={offer.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 1200px) 25vw, 300px"
                    />
                </div>

                {/* Thumbnails overlay */}
                {offer.thumbnails && (
                    <div className="absolute right-2 top-2 flex flex-col gap-2">
                        {offer.thumbnails.slice(0, 3).map((thumb, index) => (
                            <div key={index} className="relative w-16 h-12 rounded overflow-hidden border border-white/20">
                                <Image
                                    src={thumb || "/placeholder.svg"}
                                    alt={`Thumbnail ${index + 1}`}
                                    fill
                                    className="object-cover"
                                    sizes="64px"
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="p-4">
                <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded">FRONT END</span>
                    <div className="flex items-center gap-1 text-sm text-gray-300">
                        <Heart className="h-3.5 w-3.5" />
                        <span>{offer.stats.likes}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-300">
                        <Eye className="h-3.5 w-3.5" />
                        <span>{offer.stats.views}k</span>
                    </div>
                </div>

                <h3 className="font-medium mb-2 line-clamp-1">{offer.title}</h3>
                <p className="text-sm text-gray-300 line-clamp-2 mb-4">{offer.description}</p>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="relative h-6 w-6 rounded-full overflow-hidden">
                            <Image
                                src={author.image || "/placeholder.svg"}
                                alt={author.name}
                                fill
                                className="object-cover"
                                sizes="24px"
                            />
                        </div>
                        <span className="text-sm">{author.name}</span>
                    </div>

                    <Link href={`/offers/${offer.id}`} className="text-sm text-blue-400 hover:text-blue-300">
                        View details
                    </Link>
                </div>
            </div>
        </div>
    )
}


"use client"

import { Star, Eye, Heart } from "lucide-react"

interface OfferContentProps {
    offer: {
        title: string
        category: string
        description: string
        rating: number
        reviews: number
        likes: number
        views: number
    }
}

export function OfferContent({ offer }: OfferContentProps) {
    return (
        <div className="mb-8">
            <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                    <h2 className="text-2xl font-bold">{offer.title}</h2>
                    <span className="px-2 py-1 text-sm bg-white/10 rounded">{offer.category}</span>
                </div>

                <div className="flex items-center gap-6 text-sm text-gray-300">
                    <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span>{offer.rating}</span>
                        <span>({offer.reviews})</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Heart className="h-4 w-4" />
                        <span>{offer.likes}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        <span>{offer.views}</span>
                    </div>
                </div>
            </div>

            <p className="text-gray-300 leading-relaxed">{offer.description}</p>
        </div>
    )
}


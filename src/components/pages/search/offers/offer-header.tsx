"use client"

import Image from "next/image"
import { Share2, Heart, Bookmark } from "lucide-react"
import { Button } from "@/components/ui/button"

interface OfferHeaderProps {
    offer: {
        author: {
            name: string
            image: string
            role: string
        }
        title: string
        category: string
        bannerImage: string
    }
}

export function OfferHeader({ offer }: OfferHeaderProps) {
    return (
        <div className="mb-12">
            {/* Top header with author info and actions */}
            <div className="mb-4">
                <h1 className="text-xs font-semibold uppercase tracking-wider mb-4">OFFER NAME</h1>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="relative h-6 w-6 rounded-full overflow-hidden">
                            <Image
                                src={offer.author.image || "/placeholder.svg"}
                                alt={offer.author.name}
                                fill
                                className="object-cover"
                                sizes="24px"
                            />
                        </div>
                        <div>
                            <p className="text-sm font-medium">{offer.author.name}</p>
                            <p className="text-xs text-gray-400">{offer.author.role}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="hover:bg-white/10">
                            <Heart className="h-5 w-5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="hover:bg-white/10">
                            <Bookmark className="h-5 w-5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="hover:bg-white/10">
                            <Share2 className="h-5 w-5" />
                        </Button>
                        <Button className="ml-2 bg-[#0A1F44] hover:bg-[#152A50] text-white">+ Button Text</Button>
                    </div>
                </div>
            </div>

            {/* Banner image with overlapping profile */}
            <div className="relative mb-16">
                {/* Banner image */}
                <div className="relative w-full h-48 rounded-xl overflow-hidden">
                    <Image
                        src={offer.bannerImage || "/placeholder.svg"}
                        alt="Offer banner"
                        fill
                        className="object-cover"
                        sizes="(max-width: 1200px) 100vw, 1200px"
                    />
                </div>

                {/* Overlapping profile image */}
                <div className="absolute -bottom-10 left-6">
                    <div className="relative h-20 w-20 rounded-full overflow-hidden border-4 border-[#001838]">
                        <Image
                            src={offer.author.image || "/placeholder.svg"}
                            alt={offer.author.name}
                            fill
                            className="object-cover"
                            sizes="80px"
                        />
                    </div>
                </div>
            </div>

            {/* Offer title and category */}
            <div className="flex items-center gap-3">
                <h2 className="text-2xl font-semibold">{offer.title}</h2>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-400">Category</span>
                    <span className="text-sm">{offer.category}</span>
                </div>
            </div>
        </div>
    )
}


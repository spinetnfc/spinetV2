import Image from "next/image"
import { Star, Heart, Eye } from "lucide-react"

interface OfferCardProps {
    offer: {
        id: number
        title: string
        description: string
        coverImage: string
        rating: number
        likes: number
        views: number
        author: {
            name: string
            image: string
        }
    }
}

export function OfferCard({ offer }: OfferCardProps) {
    return (
        <div className="bg-[#F8F9FF] dark:bg-navy rounded-xl overflow-hidden">
            <div className="relative h-48">
                <Image
                    src={offer.coverImage || "/placeholder.svg"}
                    alt=""
                    className="object-cover"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <button className="absolute top-4 right-4 p-2 bg-white/60 rounded-full hover:bg-gray-100/80">
                    <Heart className="h-5 w-5 text-white" />
                </button>
            </div>
            <div className="p-6">
                <div className="flex items-center gap-4 mt-2">
                    <h3 className="text-lg font-semibold">{offer.title}</h3>
                    <div className="flex-1" />
                    <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="font-semibold">{offer.rating}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Heart className="h-4 w-4 fill-current" />
                        <span>{offer.likes}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4 " />
                        <span>{offer.views}k</span>
                    </div>
                </div>
                <p className="mt-4 text-gray-600 line-clamp-3">{offer.description}</p>
                <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="relative w-8 h-8 rounded-full overflow-hidden">
                            <Image
                                src={offer.author.image || "/placeholder.svg"}
                                alt={offer.author.name}
                                fill
                                className="object-cover"
                                sizes="32px"
                            />
                        </div>
                        <span className="font-medium">{offer.author.name}</span>
                    </div>
                    <button className="px-4 py-2 bg-[#001838] text-white rounded-lg hover:bg-[#002857]">View details</button>
                </div>
            </div>
        </div>
    )
}


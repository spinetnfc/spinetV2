"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { X } from "lucide-react"
import { FormattedDate, FormattedMessage } from "react-intl"

interface OfferDetailsModalProps {
    isOpen: boolean
    onClose: () => void
    offer: {
        id: number
        title: string
        description: string
        coverImage: string
        rating: number
        likes: number
        views: number
        saves?: number
        comments?: number
        postedDate?: Date
        tags?: string[]
        author: {
            name: string
            image: string
        }
    }
}

export function OfferDetailsModal({ isOpen, onClose, offer }: OfferDetailsModalProps) {
    const stats = [
        { label: "Views", value: offer.views.toLocaleString() },
        { label: "Saves", value: (offer.saves || 200).toLocaleString() },
        { label: "Likes", value: offer.likes.toLocaleString() },
        { label: "Comments", value: (offer.comments || 5).toLocaleString() },
    ]

    const defaultTags = ["Frontend", "React", "Next.js", "TypeScript", "UI/UX", "Web Development", "JavaScript", "Design"]

    return (
        <Dialog open={isOpen} onOpenChange={() => onClose()}>
            <DialogContent className=" text-primary border-none max-w-11/12 md:max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="text-xl font-regular">
                        <FormattedMessage id="offer-details" defaultMessage="Offer details" />
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Posted date */}
                    <div className="text-sm text-navy dark:text-gray-300">
                        <FormattedMessage id="posted" defaultMessage="Posted" />{" "}
                        <FormattedDate value={offer.postedDate || new Date()} year="numeric" month="long" day="numeric" />
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {stats.map((stat) => (
                            <div key={stat.label}>
                                <div className="text-navy dark:text-gray-300">{stat.label}</div>
                                <div>{stat.value}</div>
                            </div>
                        ))}
                    </div>

                    {/* Tags */}
                    <div className="space-y-3">
                        <h3 className="text-navy dark:text-gray-300">
                            <FormattedMessage id="tags" defaultMessage="Tags" />
                        </h3>
                        <div className="flex flex-wrap  gap-2">
                            {(offer.tags || defaultTags).map((tag) => (
                                <button
                                    key={tag}
                                    className="px-3 py-1 rounded-full bg-main/10 dark:bg-white/10 hover:bg-navy/20 dark:hover:bg-white/20 transition-colors text-xs"
                                >
                                    {tag}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}


"use client"
import { FormattedMessage } from "react-intl";
import { OfferCard } from "@/components/pages/search/offer-card";

interface RelatedOffersProps {
    relatedOffers: {
        id: number;
        title: string;
        description: string;
        coverImage: string;
        rating: number;
        likes: number;
        views: number;
        author: {
            name: string;
            image: string;
        };
    }[];
}

export const RelatedOffers: React.FC<RelatedOffersProps> = ({ relatedOffers }) => {
    return (
        <div className="mt-16">
            <h2 className="text-2xl font-bold mb-8">
                <FormattedMessage id="related-offers" />
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedOffers.slice(0, 3).map((offer) => (
                    <OfferCard key={offer.id} offer={offer} />
                ))}
            </div>
        </div>
    );
};

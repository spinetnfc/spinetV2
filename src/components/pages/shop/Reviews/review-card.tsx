import { Star } from 'lucide-react';
import React from 'react';
import { CircleCheck } from 'lucide-react';
interface ReviewCardProps {
    name: string;
    rating: number;
    text: string;
    verified: boolean;
    className?: string; // Added for snap alignment
}

const ReviewCard: React.FC<ReviewCardProps> = ({ name, rating, text, verified, className = '' }) => {
    return (
        <div className={`min-w-[300px] max-w-[300px] rounded-lg shadow-md p-4 border border-gray-200  dark:border-blue-950 ${className}`}>
            {/* Rating Stars */}
            <div className="flex mb-2">
                {Array.from({ length: 5 }, (_, index) => (
                    <Star
                        key={index}
                        className={`size-5 ${index < rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
                    />
                ))}
            </div>

            {/* Reviewer Name and Verification */}
            <div className="flex items-center gap-2 mb-2">
                <span className="font-semibold text-[#010E37] dark:text-[#DEE3F8]">{name}</span>
                {verified && (
                    <CircleCheck className='text-green-400 ' size={20} />
                )}
            </div>

            {/* Review Text */}
            <p className="text-gray-700 text-sm leading-relaxed dark:text-gray-300">
                {text}
            </p>
        </div>
    );
};

export default ReviewCard;
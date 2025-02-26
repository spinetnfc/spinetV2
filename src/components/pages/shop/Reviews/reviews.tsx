"use client";
import React, { useRef, useEffect } from 'react';
import useDrag from '@/hooks/use-horizontal-drag';
import ReviewCard from './review-card';
import reviews from '@/mockdata/reviews';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const Reviews: React.FC = () => {
    const reviewsContainerRef = useRef<HTMLDivElement>(null);

    // Use Drag Hook (with fallback if undefined)
    const [
        handleMouseDown,
        handleMouseLeave,
        handleMouseUp,
        handleMouseMove,
        handleWheel,
    ] = useDrag?.(reviewsContainerRef) || [];

    useEffect(() => {
        const container = reviewsContainerRef.current;
        if (container && handleWheel) {
            container.addEventListener('wheel', handleWheel, {
                passive: false, // allow preventDefault to stop vertical scrolling
            });
        }
        return () => {
            if (container && handleWheel) {
                container.removeEventListener('wheel', handleWheel);
            }
        };
    }, [handleWheel]);

    // Review data

    // Handle navigation button clicks with smooth scrolling
    const scrollLeft = () => {
        if (reviewsContainerRef.current) {
            reviewsContainerRef.current.scrollTo({
                left: reviewsContainerRef.current.scrollLeft - 316, // Scroll 300px left (card width)
                behavior: 'smooth', // Smooth transition
            });
        }
    };

    const scrollRight = () => {
        if (reviewsContainerRef.current) {
            reviewsContainerRef.current.scrollTo({
                left: reviewsContainerRef.current.scrollLeft + 316, // Scroll 300px right (card width)
                behavior: 'smooth', // Smooth transition
            });
        }
    };

    return (
        <section className="py-8 w-full">
            <div className='flex justify-between items-center p-2 xs:p-4 sm:p-8'>
                <h2 className="text-3xl font-bold text-[#010E37] text-start dark:text-[#DEE3F8]">
                    Our Happy Customers
                </h2>
                {/* Navigation buttons */}
                <div className="flex justify-center gap-4">
                    <button
                        onClick={scrollLeft}
                        className='cursor-pointer'
                        aria-label="Scroll left"
                    >
                        <ArrowLeft />
                    </button>
                    <button
                        onClick={scrollRight}
                        className='cursor-pointer'
                        aria-label="Scroll right"
                    >
                        <ArrowRight />
                    </button>
                </div>
            </div>
            <div
                ref={reviewsContainerRef}
                className="no-scrollbar flex size-full cursor-grab items-stretch gap-4 px-4 overflow-x-auto text-[#010E37] active:cursor-grabbing dark:text-[#DEE3F8]"
                onMouseDown={handleMouseDown}
                onMouseLeave={handleMouseLeave}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
            >
                {reviews.map((review, index) => (
                    <ReviewCard
                        key={index}
                        name={review.name}
                        rating={review.rating}
                        text={review.text}
                        verified={review.verified}
                    />
                ))}
            </div>

        </section>
    );
};

export default Reviews;
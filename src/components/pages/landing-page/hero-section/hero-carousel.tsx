'use client';
import Autoplay from 'embla-carousel-autoplay';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import React, { useState, useCallback, ReactNode, useEffect } from 'react';

import { cn } from '@/utils/cn';

interface HeroCarouselProps {
  slides: ReactNode[];
  locale: string;
  autoplayInterval?: number;
  isMenuOpen: boolean;
}

const HeroCarousel: React.FC<HeroCarouselProps> = ({
  slides,
  autoplayInterval = 3000,
  isMenuOpen,
}) => {
  console.log(autoplayInterval);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay()]);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const scrollTo = useCallback(
    (index: number) => {
      if (emblaApi) emblaApi.scrollTo(index);
    },
    [emblaApi],
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    emblaApi.on('select', onSelect);

    // Return a cleanup function that removes the event listener
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <div className="relative h-full overflow-hidden">
      {/* Main carousel */}
      <div ref={emblaRef} className="h-full overflow-hidden">
        <div className="flex h-full">
          {slides.map((slide, index) => (
            <div key={index} className="min-w-0 flex-[0_0_100%]">
              {slide}
            </div>
          ))}
        </div>
      </div>

      {/* Navigation arrows */}
      {!isMenuOpen && (
        <button
          type="button"
          onClick={scrollPrev}
          className="absolute left-4 top-1/2 -translate-y-1/2"
          aria-label="Previous slide"
        >
          <ChevronLeft
            className={cn('size-6', {
              'text-white': selectedIndex === 0 || selectedIndex === 3,
            })}
          />
        </button>
      )}
      {!isMenuOpen && (
        <button
          type="button"
          onClick={scrollNext}
          className="absolute right-4 top-1/2 -translate-y-1/2"
          aria-label="Next slide"
        >
          <ChevronRight
            className={cn('size-6', {
              'text-white': selectedIndex === 0 || selectedIndex === 3,
            })}
          />
        </button>
      )}

      {/* Dots navigation */}
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-3">
        {slides.map((_, index) => (
          <button
            type="button"
            key={index}
            onClick={() => scrollTo(index)}
            aria-label={`Go to slide ${index + 1}`}
            className={`size-4 rounded-full ${
              index === selectedIndex ? 'bg-white' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;

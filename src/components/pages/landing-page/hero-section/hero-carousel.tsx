import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import React, { useState, useCallback, ReactNode, useEffect } from "react";

interface HeroCarouselProps {
  slides: ReactNode[];
  locale: string;
  autoplayInterval?: number;
  isMenuOpen: boolean;
  setActiveIndex: (index: number) => void;
}

const HeroCarousel: React.FC<HeroCarouselProps> = ({
  slides,
  locale,
  autoplayInterval = 5000,
  isMenuOpen,
  setActiveIndex,
}) => {
  const isRTL = locale === "ar" || locale === "he"; // Detect RTL language
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, direction: isRTL ? "rtl" : "ltr" }, // Set direction dynamically
    [Autoplay({ delay: autoplayInterval })]
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    const newIndex = emblaApi.selectedScrollSnap();
    setActiveIndex(newIndex);
  }, [emblaApi, setActiveIndex]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  // Function to move to the previous slide
  const scrollPrev = () => {
    if (emblaApi) emblaApi.scrollPrev();
  };

  // Function to move to the next slide
  const scrollNext = () => {
    if (emblaApi) emblaApi.scrollNext();
  };

  return (
    <div className="relative h-full overflow-hidden" dir={isRTL ? "rtl" : "ltr"}>
      <div ref={emblaRef} className="h-full overflow-hidden">
        <div className="flex h-full">
          {slides.map((slide, index) => (
            <div key={index} className="min-w-0 flex-[0_0_100%]">
              {slide}
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      <button
        className={`absolute hidden md:block left-1 
        top-1/2 z-10 -translate-y-1/2 rounded-full dark:bg-white p-1 shadow-md transition cursor-pointer
        hover:bg-navy bg-main dark:hover:bg-gray-200`}
        onClick={isRTL ? scrollNext : scrollPrev} // Swap button action for RTL
      >
        <ChevronLeft className="size-6 dark:text-gray-700 text-gray-200" />
      </button>

      <button
        className={`absolute hidden md:block right-1 
        top-1/2 z-10 -translate-y-1/2 rounded-full dark:bg-white p-1 shadow-md transition cursor-pointer
        hover:bg-navy bg-main dark:hover:bg-gray-200`}
        onClick={isRTL ? scrollPrev : scrollNext} // Swap button action for RTL
      >
        <ChevronRight className="size-6 dark:text-gray-700 text-gray-200" />
      </button>
    </div>
  );
};

export default HeroCarousel;

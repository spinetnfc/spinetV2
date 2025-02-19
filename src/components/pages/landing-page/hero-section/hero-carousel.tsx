import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import React, { useState, useCallback, ReactNode, useEffect } from "react";

interface HeroCarouselProps {
  slides: ReactNode[];
  locale: string;
  autoplayInterval?: number;
  isMenuOpen: boolean;
}

const HeroCarousel: React.FC<HeroCarouselProps> = ({
  slides,
  locale,
  autoplayInterval = 5000,
  isMenuOpen,
}) => {
  const isRTL = locale === "ar"; // Check if RTL mode is active
  const [selectedIndex, setSelectedIndex] = useState(0);

  // autoplay options
  const autoplayOptions = { delay: autoplayInterval, stopOnInteraction: false };

  // Initialize Embla with correct direction
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, direction: isRTL ? "rtl" : "ltr" },
    [Autoplay(autoplayOptions)]
  );

  const scrollPrev = useCallback(() => {
    emblaApi?.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    emblaApi?.scrollNext();
  }, [emblaApi]);

  const scrollTo = useCallback(
    (index: number) => {
      emblaApi?.scrollTo(index);
    },
    [emblaApi]
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  // Ensure Embla listens for selection changes
  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);

    if ((emblaApi as any).plugins?.autoplay) {
      (emblaApi as any).plugins.autoplay.start();
    }

    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  // Fix: Reinitialize when switching between LTR/RTL
  useEffect(() => {
    if (emblaApi) {
      emblaApi.reInit();
    }
  }, [emblaApi, locale]);

  return (
    <div
      className="relative h-full overflow-hidden"
      dir={isRTL ? "rtl" : "ltr"} // Ensures correct text & layout direction
    >
      <div ref={emblaRef} className="h-full overflow-hidden">
        <div className="flex h-full">
          {slides.map((slide, index) => (
            <div key={index} className="min-w-0 flex-[0_0_100%]">
              {slide}
            </div>
          ))}
        </div>
      </div>

      {!isMenuOpen && (
        <>
          <button
            type="button"
            onClick={scrollPrev}
            className={`absolute top-1/2 -translate-y-1/2 ${isRTL ? "right-4" : "left-4"
              }`} // Swap button positions in RTL
            aria-label="Previous slide"
          >
            <ChevronLeft className={`hidden sm:block size-6 ${isRTL ? "scale-x-[-1]" : ""}`} />
          </button>
          <button
            type="button"
            onClick={scrollNext}
            className={`absolute top-1/2 -translate-y-1/2 ${isRTL ? "left-4" : "right-4"
              }`} // Swap button positions in RTL
            aria-label="Next slide"
          >
            <ChevronRight className={`hidden sm:block size-6 ${isRTL ? "scale-x-[-1]" : ""}`} />
          </button>
        </>
      )}

      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-3">
        {slides.map((_, index) => (
          <button
            type="button"
            key={index}
            onClick={() => scrollTo(index)}
            aria-label={`Go to slide ${index + 1}`}
            className={`size-4 rounded-full ${index === selectedIndex ? "bg-white" : "bg-white/50"
              }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;

/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useRef, useEffect } from 'react';

import useDrag from '@/hooks/use-horizontal-drag'; // Using the same drag hook from Features

import PricingCard from './pricing-card';

// Pricing Component
const Pricing: React.FC = () => {
  const pricingContainerRef = useRef<HTMLDivElement>(null);
  const [
    handleMouseDown,
    handleMouseLeave,
    handleMouseUp,
    handleMouseMove,
    handleWheel,
  ] = useDrag(pricingContainerRef);

  useEffect(() => {
    const Container = pricingContainerRef.current;
    if (Container) {
      Container.addEventListener('wheel', handleWheel, {
        passive: false,
      });
    }
    return () => {
      if (Container) {
        Container.removeEventListener('wheel', handleWheel);
      }
    };
  }, [handleWheel]);

  // Pricing data
  const pricingOptions = [
    {
      title: 'free',
      price: '0 DA',
      features: ['free-f1', 'free-f2', 'free-f3', 'free-f4', 'free-f5'],
      limittedFeatures: ['free-f2', 'free-f3', 'free-f4', 'free-f5'],
    },
    {
      title: 'plus',
      price: '$$$ DA',
      features: ['plus-f1', 'plus-f2', 'plus-f3'],
      isMostPopular: true,
    },
    {
      title: 'pro',
      price: '$$$ DA',
      features: ['pro-f1', 'pro-f2', 'pro-f3'],
    },
    {
      title: 'company',
      price: '$$$ DA',
      features: ['company-f1', 'company-f2', 'company-f3', 'company-f4'],
      isDisabled: true,
    },
  ];

  return (
    <>
      {/* Large Screen Grid Layout */}
      <div className="hidden w-full flex-col gap-4 p-4 lg:flex ">
        <PricingCard
          title={pricingOptions[0].title}
          subtitle="Fames ornare libero nunc, eget."
          price={pricingOptions[0].price}
          features={pricingOptions[0].features}
          limittedFeatures={pricingOptions[0].limittedFeatures}
          widthFull
          index={0}
        />

        <div className="flex w-full justify-between gap-4">
          {pricingOptions.slice(1).map((option, index) => (
            <PricingCard
              key={index}
              title={option.title}
              price={option.price}
              features={option.features}
              index={index + 1}
            />
          ))}
        </div>
      </div>

      {/* Mobile/Small Screen Horizontal Scroll */}
      <div
        ref={pricingContainerRef}
        className="no-scrollbar flex size-full cursor-grab items-stretch space-x-4 overflow-x-auto  text-[#010E37] active:cursor-grabbing dark:text-[#DEE3F8] lg:hidden"
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      >
        {pricingOptions.map((option, index) => (
          <PricingCard
            key={index}
            title={option.title}
            price={option.price}
            features={option.features}
            index={index}
          />
        ))}
      </div>
    </>
  );
};

export default Pricing;

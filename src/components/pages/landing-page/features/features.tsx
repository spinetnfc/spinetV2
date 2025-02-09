/* eslint-disable jsx-a11y/no-static-element-interactions */
'use client';
import React, { useEffect, useRef } from 'react';
import { FormattedMessage, IntlProvider } from 'react-intl';

import useDrag from '@/hooks/use-horizontal-drag';

import Legend from '../legend';

import FeatureCard from './feature-card';

type Props = { locale: string; messages: Record<string, string> };

function Features({ locale, messages }: Props) {
  const featuresContainerRef = useRef<HTMLDivElement>(null);
  const [
    handleMouseDown,
    handleMouseLeave,
    handleMouseUp,
    handleMouseMove,
    handleWheel,
  ] = useDrag(featuresContainerRef);
  const features = [
    {
      title: 'f1',
      subtitle: 'f1-subtitle',
      imageUrl: '/img/features/1.digital-identity.png',
    },
    {
      title: 'f2',
      subtitle: 'f2-subtitle',
      imageUrl: '/img/features/2.spinet-devices.png',
    },
    {
      title: 'f3',
      subtitle: 'f3-subtitle',
      imageUrl: '/img/features/3.contact-management.jpg',
    },
    {
      title: 'f4',
      subtitle: 'f4-subtitle',
      imageUrl: '/img/features/4.lead-management.png',
    },
    {
      title: 'f5',
      subtitle: 'f5-subtitle',
      imageUrl: '/img/features/5.actions-managemnet.svg',
    },
    {
      title: 'f6',
      subtitle: 'f6-subtitle',
      imageUrl: '/img/features/6.multiple-profiles.png',
    },
    {
      title: 'f7',
      subtitle: 'f7-subtitle',
      imageUrl: '/img/features/7.offers.svg',
    },
    {
      title: 'f8',
      subtitle: 'f8-subtitle',
      imageUrl: '/img/features/8.teams-forms-redirections.png',
    },
  ];

  useEffect(() => {
    const Container = featuresContainerRef.current;
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

  return (
    <IntlProvider locale={locale} messages={messages}>
      <div className=" flex w-full flex-col items-center justify-center gap-2.5 overflow-x-hidden px-3 py-1.5 lg:gap-4">
        <Legend
          text="Maximize Your Enterprise Potential with Our Services"
          locale={locale}
        />
        <div className=" text-center text-5xl leading-[60px] text-[#1A3B8E] dark:text-white">
          <FormattedMessage id="Features" />
        </div>
        <span className="text-center text-xl text-[#1A3B8E]/80 dark:text-white">
          <FormattedMessage id="Features-text" />
        </span>

        <div
          ref={featuresContainerRef}
          className="no-scrollbar flex h-fit w-full cursor-grab items-center space-x-4  overflow-x-auto active:cursor-grabbing"
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
        >
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              imageUrl={feature.imageUrl}
              title={feature.title}
              subtitle={feature.subtitle}
            />
          ))}
        </div>
      </div>
    </IntlProvider>
  );
}

export default Features;

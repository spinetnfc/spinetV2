/* eslint-disable jsx-a11y/no-static-element-interactions */
'use client';
import React, { useEffect, useRef, useCallback } from 'react';
import { FormattedMessage, IntlProvider } from 'react-intl';

import useDrag from '@/hooks/use-horizontal-drag';
import Legend from '../legend';
import FeatureCard from './feature-card';
import digitalIdentityImg from '@/assets/images/features/1.digital-identity.jpg';
import spinetDevicesImg from '@/assets/images/features/2.spinet-devices.jpg';
import contactManagementImg from '@/assets/images/features/3.contact-management.jpg';
import leadManagementImg from '@/assets/images/features/4.lead-management.png';
import actionsManagementImg from '@/assets/images/features/5.actions-managemnet.svg';
import multipleProfilesImg from '@/assets/images/features/6.multiple-profiles.png';
import offersImg from '@/assets/images/features/7.offers.svg';
import teamsFormsRedirectionsImg from '@/assets/images/features/8.teams-forms-redirections.png';
import { getLocale } from '@/utils/getClientLocale';

type Props = {  messages: Record<string, string> };

function Features({  messages }: Props) {
  const featuresContainerRef = useRef<HTMLDivElement>(null);
  const [
    handleMouseDown,
    handleMouseLeave,
    handleMouseUp,
    handleMouseMove,
    handleWheel,
  ] = useDrag(featuresContainerRef);
    const locale = getLocale() || "en";

  // Updated wheel handler: if deltaX is 0, fallback to deltaY.
  const handleWheelWrapper = useCallback((e: WheelEvent) => {
    if (featuresContainerRef.current) {
      // Use deltaX if nonzero; otherwise, assume vertical gesture should scroll horizontally.
      const horizontalDelta = e.deltaX !== 0 ? e.deltaX : e.deltaY;
      e.preventDefault();
      featuresContainerRef.current.scrollLeft += horizontalDelta;
    }
  }, []);

  const features = [
    { title: 'f1', subtitle: 'f1-subtitle', imageUrl: digitalIdentityImg },
    { title: 'f2', subtitle: 'f2-subtitle', imageUrl: spinetDevicesImg },
    { title: 'f3', subtitle: 'f3-subtitle', imageUrl: contactManagementImg },
    { title: 'f4', subtitle: 'f4-subtitle', imageUrl: leadManagementImg },
    { title: 'f5', subtitle: 'f5-subtitle', imageUrl: actionsManagementImg },
    { title: 'f6', subtitle: 'f6-subtitle', imageUrl: multipleProfilesImg },
    { title: 'f7', subtitle: 'f7-subtitle', imageUrl: offersImg },
    { title: 'f8', subtitle: 'f8-subtitle', imageUrl: teamsFormsRedirectionsImg },
  ];

  useEffect(() => {
    const container = featuresContainerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheelWrapper, { passive: false });
    }
    return () => {
      if (container) {
        container.removeEventListener('wheel', handleWheelWrapper);
      }
    };
  }, [handleWheelWrapper]);

  return (
    <IntlProvider locale={locale} messages={messages}>
      <div className="flex w-full flex-col items-center justify-center gap-2.5 overflow-x-hidden px-3 py-1.5 lg:gap-4">
        <Legend text="Maximize Your Enterprise Potential with Our Services" locale={locale} />
        <div className="text-center text-4xl sm:text-5xl leading-[60px] text-[#1A3B8E] dark:text-white">
          <FormattedMessage id="Features" />
        </div>
        <span className="text-center text-lg sm:text-xl text-[#1A3B8E]/80 dark:text-white">
          <FormattedMessage id="Features-text" />
        </span>
        <div
          ref={featuresContainerRef}
          className="no-scrollbar mt-4 flex h-fit w-full cursor-grab items-center space-x-4 overflow-x-auto active:cursor-grabbing"
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

import { ChevronRight } from 'lucide-react';
import Image from 'next/image';
import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import CtaButton from '../cta-button';
import eventsBg from "@/assets/images/organiser-evenement-digital-entreprise.jpeg"
type Props = {
  locale: string;
  isMenuOpen: boolean;
  setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

function Events({ locale, isMenuOpen, setIsMenuOpen }: Props) {
  const intl = useIntl();
  return (
    <div className="relative flex h-full flex-col  items-center justify-center   overflow-hidden">
      <div className="flex size-full items-center justify-center">
        {' '}
        <div className="absolute inset-0 bg-[#01173A]/50 object-cover shadow-[0_-1px_4px_rgba(20,95,242,0.2)]">
          <Image
            src={eventsBg}
            quality={100}
            priority
            alt="Digital Event Organization"
            className="mix-blend-overlay blur-sm opacity-70"
            fill
            sizes='100vw'
            style={{ objectFit: 'cover' }}
          />
        </div>
        <div
          id="thisOne"
          className="z-10 flex  flex-col items-center justify-center gap-4"
        >
          {/* Section Text */}
          <div className="flex flex-col items-center  justify-center gap-4 p-4">
            {/* Top */}

            <h1 className="text-center text-3xl xs:text-4xl sm:text-5xl lg:text-6xl xl:text-8xl font-semibold text-[#EEF6FF]">
              {' '}
              <FormattedMessage id="spinet-events-and" />
            </h1>
            <h1 className="text-center text-3xl xs:text-4xl sm:text-5xl lg:text-6xl xl:text-8xl font-semibold text-[#EEF6FF]">
              {' '}
              <FormattedMessage id="more" />
            </h1>

            {/* Paragraph */}
            <p className="  w-full text-center text-xl  font-medium text-[#EEF6FF]/80">
              <FormattedMessage id="spinet-events-and-more-text" />
            </p>
          </div>
          <CtaButton
            text={intl.formatMessage({ id: 'checkout-spinet-events' })}
            icon={<ChevronRight className="size-6" />}
            iconposition="right"
            link="https://events.spinetnfc.com/login"
            newTab={true}
            className='text-base xs:text-lg sm:text-xl'
          />
        </div>
      </div>
    </div>
  );
}

export default Events;

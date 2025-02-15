import { ChevronRight } from 'lucide-react';
import Image from 'next/image';
import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import CtaButton from '../cta-button';

import NavBar from './nav-bar';

type Props = {
  locale: string;
  isMenuOpen: boolean;
  setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

function Events({ locale, isMenuOpen, setIsMenuOpen }: Props) {
  const intl = useIntl();
  return (
    <div className=" relative flex h-full flex-col  items-center justify-center   overflow-hidden pt-16">
      {/* <NavBar
        locale={locale}
        parentDarkMode={true}
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
      /> */}
      <div className="   flex size-full items-center justify-center">
        {' '}
        <div className="absolute inset-0 bg-[#01173A]/30 object-cover shadow-[0_-1px_4px_rgba(20,95,242,0.2)]">
          <Image
            src="/img/organiser-evenement-digital-entreprise.jpeg"
            alt="Digital Event Organization"
            className="mix-blend-overlay"
            fill
            sizes='100vw'
            style={{ objectFit: 'cover' }}
            priority
          />
        </div>
        <div
          id="thisOne"
          className="z-10 flex  flex-col items-center justify-center gap-4  "
        >
          {/* Section Text */}
          <div className="flex flex-col items-center  justify-center gap-4 p-4">
            {/* Top */}

            <h1 className="text-center text-5xl font-semibold text-[#EEF6FF] lg:text-7xl">
              {' '}
              <FormattedMessage id="spinet-events-and-more" />
            </h1>

            {/* Paragraph */}
            <p className="  w-full text-center text-xl  font-medium text-[#EEF6FF]">
              <FormattedMessage id="spinet-events-and-more-text" />
            </p>
          </div>
          <CtaButton
            text={intl.formatMessage({ id: 'checkout-spinet-events' })}
            icon={<ChevronRight className="size-6" />}
            iconPosition="right"
          />
        </div>
      </div>
    </div>
  );
}

export default Events;

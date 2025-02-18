import { Search } from 'lucide-react';
import Image from 'next/image';
import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import CtaButton from '../cta-button';


type Props = {
  locale: string;
  isMenuOpen: boolean;
  setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

function DigitalIdentity({ locale, isMenuOpen, setIsMenuOpen }: Props) {
  const intl = useIntl();
  return (
    <div className="relative flex h-full flex-col  overflow-hidden pt-16
     bg-[url('/img/digital-identity-bg.png')] bg-cover bg-no-repeat
     ">
      <div className="flex size-full flex-col lg:flex-row">
        <div className="z-10 mx-5 mt-20  flex h-3/5 w-full flex-col items-center gap-4 lg:me-0 lg:ms-10 lg:w-1/2 lg:items-start">
          {/* Section Text */}
          <div className="flex flex-col gap-4  ">
            {/* Top */}

            <h1 className="text-5xl font-semibold text-[#EEF6FF] lg:text-7xl">
              {' '}
              <FormattedMessage id="digital-identity" />
            </h1>

            {/* Paragraph */}
            <p className="  w-full text-xl  font-medium text-[#EEF6FF]">
              <FormattedMessage id="digital-identity-text" />
            </p>
          </div>

          <CtaButton
            icon={<Search className="size-6" />}
            text={intl.formatMessage({ id: 'search-spinet' })}
            className="lg:w-[308px]"
          />
        </div>
        <div className="relative size-full">
          <Image
            src="/img/hand-finger-print.png"
            alt="Hand image"
            fill
            sizes='100%'
            priority
          />
        </div>
      </div>
    </div>
  );
}

export default DigitalIdentity;

import { Search } from 'lucide-react';
import Image from 'next/image';
// import Spline from '@splinetool/react-spline';
import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import CtaButton from '../cta-button';
import digitalIdentityBg from "@/assets/images/digital-identity-background.png"
import handFingerPrint from "@/assets/images/hand-finger-print.png"

type Props = {
  locale: string;
  isMenuOpen: boolean;
  setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

function DigitalIdentity({ locale, isMenuOpen, setIsMenuOpen }: Props) {
  const intl = useIntl();
  return (
    <div
      className={`relative flex h-full flex-col overflow-hidden pt-16
        bg-cover bg-no-repeat`}
      style={{ backgroundImage: `url(${digitalIdentityBg.src})` }}
    >
      <div className="flex size-full flex-col lg:flex-row">
        {/* Left Content Section */}
        <div className="z-10 flex h-3/5 w-full flex-col justify-center lg:w-1/2 lg:h-auto px-4 lg:px-8 xl:px-12">
          <div className="flex flex-col gap-6 lg:gap-8  mx-auto lg:mx-0">
            {/* Title */}
            <h1 className="text-3xl xs:text-4xl sm:text-5xl lg:text-6xl xl:text-8xl text-center lg:text-start font-semibold text-spinet-light leading-tight">
              <FormattedMessage id="digital-identity" />
            </h1>

            {/* Description */}
            <p className="text-base sm:text-xl text-center lg:text-start font-medium text-spinet-light/80 leading-relaxed">
              <FormattedMessage id="digital-identity-text" />
            </p>

            {/* CTA Button */}
            <div className="flex justify-center lg:justify-start">
              <CtaButton
                icon={<Search className="size-6" />}
                text={intl.formatMessage({ id: 'search-spinet' })}
                className="lg:w-[308px] text-base xs:text-lg sm:text-xl"
                link='/search'
              />
            </div>
          </div>
        </div>

        {/* Right Image Section */}
        <div className="relative flex size-full flex-col items-center justify-end lg:w-1/2 lg:justify-center">
          <Image
            quality={100}
            src={handFingerPrint}
            alt="Hand image"
            width={600}
            height={600}
            className='h-auto max-w-full lg:max-w-[80%] xl:max-w-[70%] aspect-[1/1] object-contain'
            priority
          />
        </div>
      </div>
    </div>
  );
}

export default DigitalIdentity;

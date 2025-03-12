import { Search } from 'lucide-react';
import Image from 'next/image';
import Spline from '@splinetool/react-spline';
import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import CtaButton from '../cta-button';
// import { useTheme } from 'next-themes';

type Props = {
  locale: string;
  isMenuOpen: boolean;
  setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

function DigitalIdentity({ locale, isMenuOpen, setIsMenuOpen }: Props) {
  const intl = useIntl();
  // const theme = useTheme();
  return (
    <div
      className={`relative flex h-full flex-col  overflow-hidden pt-16
     bg-[url('/img/digital-identity-background.png')] bg-cover bg-no-repeat`}
    //  className={`relative flex h-full flex-col overflow-hidden pt-16 
    //   ${theme.theme === "dark" ? "bg-[url('/img/digital-identity-background.png')]" : "bg-[url('/img/digital-identity-background-light.png')]"} 
    //   bg-cover bg-no-repeat`}
    >
      <div className="flex size-full flex-col lg:flex-row">
        <div className="z-10 lg:mx-5 mt-20 flex h-3/5 w-full flex-col items-center gap-4 lg:me-0 lg:ms-10 lg:items-start">
          {/* Section Text */}
          <div className="flex flex-col gap-4 ">
            {/* Top */}

            <h1 className="text-4xl xs:text-5xl lg:text-6xl xl:text-7xl text-center lg:text-start font-semibold text-[#EEF6FF]">
              {' '}
              <FormattedMessage id="digital-identity" />
            </h1>

            {/* Paragraph */}
            <p className="w-full text-base sm:text-xl text-center lg:text-start font-medium text-[#EEF6FF] ">
              <FormattedMessage id="digital-identity-text" />
            </p>
          </div>

          <CtaButton
            icon={<Search className="size-6" />}
            text={intl.formatMessage({ id: 'search-spinet' })}
            className="lg:w-[308px] text-base xs:text-lg sm:text-xl"
            link='/search'
          />
        </div>
        <div className="relative flex size-full flex-col items-center justify-end flex-grow">
          <Image
            src="/img/Designer.png"
            alt="Hand image"
            width={600} // Set a fixed width
            height={600} // Adjust height accordingly to maintain aspect ratio
            className='h-auto max-w-full mt-auto lg:w-[700px] aspect-[1/1]'
            priority
          />
          {/* <Spline
            scene="https://prod.spline.design/vE8CaPtt6QlDw0g3/scene.splinecode"
            className="w-[300px] sm:w-[400px] md:w-[500px] lg:w-[600px] xl:w-[700px] h-auto [&>canvas]:w-full [&>canvas]:h-full flex justify start items-start"
          /> */}

        </div>
      </div>
    </div>
  );
}

export default DigitalIdentity;

import { ChevronRight } from 'lucide-react';
import Image from 'next/image';
import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Button } from '@/components/ui/button';
import CtaButton from '../cta-button';
import transformBusiness from "@/assets/images/transform-business.png";
type Props = {
  locale: string;
  isMenuOpen: boolean;
  setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isActive: boolean; // New prop to check if this slide is active
};

function TransformBusiness({ locale, isMenuOpen, setIsMenuOpen, isActive }: Props) {
  const intl = useIntl();
  function scrollToSection(id: string, setIsMenuOpen?: React.Dispatch<React.SetStateAction<boolean>>) {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      setIsMenuOpen?.(false);
    }
  }

  return (
    <div className="relative flex size-full flex-col pt-16">
      <div className="flex size-full flex-col lg:flex-row">
        <div className="z-10 px-4 flex h-3/5 lg:h-full w-full flex-col items-center justify-center gap-4 lg:me-0 lg:ms-10 lg:w-1/2">
          {/* Section Text */}
          <div className="flex flex-col gap-3">
            <span className="text-lg sm:text-xl text-[#145FF2] text-center lg:text-start">
              <FormattedMessage id="one-solution-for-all" />
            </span>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl md:text-7xl text-[#1A3B8E] dark:text-[#EEF6FF] text-center lg:text-start">
              <FormattedMessage id="transform-your" />{' '}
              <span className="font-extrabold">
                <FormattedMessage id="business" />
              </span>{' '}
              <FormattedMessage id="with-spinet" />
            </h1>

            {/* Paragraph */}
            <p className="w-full text-center lg:text-start text-lg sm:text-xl font-normal text-[#1A3B8E] dark:text-[#EEF6FF]">
              <FormattedMessage id="transform-your-with-spinet-text" />
            </p>
          </div>

          <div className="mt-4 sm:mt-10 flex flex-col items-center justify-center gap-4 lg:flex-row">
            <CtaButton
              text={intl.formatMessage({ id: 'free-trial' })}
              icon={<ChevronRight className="ms-2.5 size-6" />}
              iconposition="right"
              className="text-base xs:text-lg sm:text-xl"
            />

            <Button
              className="cursor-pointer h-12 rounded-2xl bg-white text-base xs:text-lg sm:text-xl leading-6 text-[#145FF2] 
             transition-all hover:bg-blue-500 hover:text-white hover:brightness-125 dark:bg-navy dark:text-white"
              onClick={() => scrollToSection("features")}
            >
              <FormattedMessage id="see-features" />
            </Button>
          </div>
        </div>

        {/* Image with slide-in animation */}
        <div
          className={`w-full lg:w-auto transition-transform duration-2000 ease-out 
          ${isActive
              ? "translate-x-0 opacity-100"
              : locale === "ar"
                ? "-translate-x-full opacity-0" // Slide in from left in RTL
                : "translate-x-full opacity-0"  // Slide in from right in LTR
            }`}
        >
          <Image
            src={transformBusiness}
            quality={100}
            alt="Transform business image"
            width={1075}
            height={920}
            priority
          />
        </div>
      </div>
    </div>
  );
}

export default TransformBusiness;

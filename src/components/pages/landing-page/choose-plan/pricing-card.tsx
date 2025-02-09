import { ShoppingCart, ArrowRight, LogIn } from 'lucide-react';
import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import CheckIcon from '@/components/icons/check-icon';
import LimitedIcon from '@/components/icons/limited-icon';

import CtaButton from '../cta-button';

interface PricingCardProps {
  index: number;
  //   title: 'Free' | 'Plus' | 'Pro' | 'Company';
  title: string;
  subtitle?: string;
  price: string;
  features: string[];
  widthFull?: boolean;
  limittedFeatures?: string[];
}

const PricingCard: React.FC<PricingCardProps> = ({
  index,
  title,
  subtitle,
  price,
  features,
  limittedFeatures,
  widthFull = false,
}) => {
  const intl = useIntl();
  if (widthFull)
    return (
      <div className="flex w-full flex-col gap-4  rounded-xl border border-[#145FF4]  px-2 py-4  transition-shadow duration-300 hover:cursor-pointer hover:shadow-[0px_9px_19px_rgba(0,0,0,0.69),0px_140px_56px_rgba(0,0,0,0.1)] dark:hover:shadow-[0px_9px_19px_rgba(100,100,100,0.69),0px_140px_56px_rgba(100,100,100,0.1)]">
        <div className="flex justify-between ">
          <div className=" flex flex-col gap-2  ">
            <h2 className="text-4xl font-bold leading-[150%]">
              <FormattedMessage id={title} />
            </h2>
            <div className="text-sm  font-normal">{subtitle}</div>
          </div>
          <div className="text-xl font-semibold ">{price}</div>
        </div>
        <div className="flex w-full items-center  justify-between ">
          <div className="grid grid-cols-2 grid-rows-3 gap-x-4 gap-y-6">
            {features?.map((feature, index) => (
              <div key={index} className="flex flex-row items-center gap-3">
                <CheckIcon className="size-5" />
                <div className="flex items-center gap-1">
                  {' '}
                  <span className="text-[14px] font-medium ">
                    <FormattedMessage id={feature} />
                  </span>
                  {limittedFeatures?.includes(feature) && <LimitedIcon />}
                </div>
              </div>
            ))}
          </div>
          <CtaButton
            text={intl.formatMessage({ id: 'sign-up' })}
            icon={<LogIn className="me-2.5 size-6" />}
          />
        </div>
      </div>
    );
  return (
    <div className="noSelect  flex w-full  flex-col gap-4 rounded-xl border border-[#145FF4] px-2 py-4 transition-shadow duration-300 hover:cursor-pointer hover:shadow-[0px_9px_19px_rgba(0,0,0,0.69)] dark:hover:shadow-[0px_9px_19px_rgba(100,100,100,0.69)]">
      <div className=" flex flex-col gap-2.5 ">
        <h2 className="text-4xl font-bold  leading-[150%]">
          {' '}
          <FormattedMessage id={title} />
        </h2>
        <div className="text-lg font-semibold ">{price}</div>
      </div>

      <div className=" flex flex-1 flex-col gap-4">
        {features.map((feature, index) => (
          <div key={index} className="flex flex-row items-center gap-5">
            <CheckIcon className="size-5" />
            <span className="text-[14px] font-medium ">
              {' '}
              <FormattedMessage id={feature} />
            </span>
          </div>
        ))}
      </div>
      <div className="mt-auto">
        {' '}
        {index === 0 ? (
          <CtaButton
            text={intl.formatMessage({ id: 'sign-up' })}
            icon={<LogIn className="me-2.5 size-6" />}
          />
        ) : (
          <div className=" flex flex-row items-center gap-2 ">
            <CtaButton
              icon={<ShoppingCart className="ms-2.5 size-6" />}
              text={intl.formatMessage({ id: 'buy-now' })}
            />
            <div className="flex flex-row items-center gap-[3.5px] rounded-xl px-2 py-1  hover:cursor-pointer dark:text-[#F4F0FF]">
              <span className="text-sm font-medium ">
                <FormattedMessage id="free-trial" />
              </span>
              <ArrowRight className="size-5" />
            </div>
          </div>
        )}{' '}
      </div>
    </div>
  );
};

export default PricingCard;

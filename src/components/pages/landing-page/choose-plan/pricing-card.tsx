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
      <div className="flex w-full flex-col gap-6 rounded-2xl border border-spinet-primary bg-card p-6 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
        <div className="flex justify-between items-start">
          <div className="flex flex-col gap-3">
            <h2 className="text-4xl font-bold leading-tight text-card-foreground">
              <FormattedMessage id={title} />
            </h2>
            {subtitle && (
              <p className="text-base text-muted-foreground">{subtitle}</p>
            )}
          </div>
          <div className="text-2xl font-bold text-spinet-primary">{price}</div>
        </div>

        <div className="flex w-full items-center justify-between">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {features?.map((feature, index) => (
              <div key={index} className="flex flex-row items-center gap-3">
                <CheckIcon className="size-5 text-spinet-primary flex-shrink-0" />
                <div className="flex items-center gap-1">
                  <span className="text-sm font-medium text-card-foreground">
                    <FormattedMessage id={feature} />
                  </span>
                  {limittedFeatures?.includes(feature) && <LimitedIcon />}
                </div>
              </div>
            ))}
          </div>
          <div className="ml-8">
            <CtaButton
              text={intl.formatMessage({ id: 'sign-up' })}
              icon={<LogIn className="me-2.5 size-6" />}
              className="px-6 py-3"
            />
          </div>
        </div>
      </div>
    );

  return (
    <div className="noSelect flex min-w-[calc(100vw-44px)] xs:min-w-[300px] lg:w-full flex-col gap-6 rounded-2xl border border-input bg-card p-6 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
      <div className="flex flex-col gap-3">
        <h2 className="text-3xl font-bold leading-tight text-card-foreground">
          <FormattedMessage id={title} />
        </h2>
        <div className="text-xl font-bold text-spinet-primary">{price}</div>
      </div>

      <div className="flex flex-1 flex-col gap-4">
        {features.map((feature, index) => (
          <div key={index} className="flex flex-row items-center gap-3">
            <CheckIcon className="size-5 text-spinet-primary flex-shrink-0" />
            <span className="text-sm font-medium text-card-foreground">
              <FormattedMessage id={feature} />
            </span>
          </div>
        ))}
      </div>

      <div className="mt-auto pt-4 border-t border-border">
        {index === 0 ? (
          <div className='flex justify-center'>
            <CtaButton
              className='text-sm px-4 py-2'
              text={intl.formatMessage({ id: 'sign-up' })}
              icon={<LogIn className="me-2.5 size-5" />}
            />
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <CtaButton
              className='text-sm w-full justify-center'
              icon={<ShoppingCart className="me-2.5 size-5" />}
              text={intl.formatMessage({ id: 'buy-now' })}
            />
            <button className="flex flex-row items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-spinet-primary hover:bg-spinet-primary/10 transition-colors">
              <FormattedMessage id="free-trial" />
              <ArrowRight className="size-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PricingCard;

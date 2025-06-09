import Image from 'next/image';
import React from 'react';
import { FormattedMessage } from 'react-intl';

interface FeatureCardProps {
  imageUrl: string;
  title: string;
  subtitle: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  imageUrl,
  title,
  subtitle,
}) => {
  return (
    <div className="noSelect flex shrink-0 flex-col  overflow-hidden h-[532px] w-3/4 sm:w-[542px]">
      <div className="relative h-[383px] w-full bg-white">
        <Image src={imageUrl}
          alt={title}
          draggable={false}
          fill
          sizes='w-fit'
          className="object-cover rounded-lg"
        />
      </div>

      <div className="flex flex-col space-y-2 p-6">
        <div className="bg-linear-to-r from-[#145FF2] to-[#BDDDFF] bg-clip-text font-inter text-sm font-medium text-transparent dark:from-[#EEF6FF] dark:to-[#2375F3]">
          <FormattedMessage id="Features" />
        </div>

        <h3 className=" text-[23.4375px] leading-8 text-[#1A3B8E]/80 dark:text-white">
          <FormattedMessage id={title} />
        </h3>

        <p className="text-sm leading-5 text-[#1A3B8E]/80 dark:text-white">
          <FormattedMessage id={subtitle} />
        </p>
      </div>
    </div>
  );
};

export default FeatureCard;

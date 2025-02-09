'use client';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import React, { useEffect, useState } from 'react';

import StepArrowHorizontal from '@/components/icons/step-arrow-horizontal';
import StepArrowVertical from '@/components/icons/step-arrow-vertical';
import { cn } from '@/utils/cn';

type Props = {
  imageUrl: string;
  text: string;
  ordinal: string;
};

function StepCard({ imageUrl, text, ordinal }: Props) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Handle mounting state
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) {
    return null;
  }
  return (
    <>
      <div className="noSelect  mx-2 flex flex-col items-center justify-center overflow-hidden rounded-lg">
        <div
          className={cn('relative h-[305px] w-[148px]  ', {
            'w-full lg:w-[457px]': ordinal === 'Third' || ordinal === 'Fourth',
          })}
        >
          <Image
            src={
              ordinal !== 'Third' && ordinal !== 'Fourth'
                ? imageUrl
                : resolvedTheme === 'dark'
                  ? imageUrl
                  : imageUrl.slice(0, imageUrl.lastIndexOf('.')) +
                    '-light' +
                    imageUrl.slice(imageUrl.lastIndexOf('.'))
            }
            alt={text}
            fill
            className="object-cover"
          />
        </div>

        <div className="flex flex-col space-y-2 p-6">
          <div className="bg-gradient-to-r from-[#145FF2] to-[#BDDDFF] bg-clip-text font-inter text-sm font-medium text-transparent dark:from-[#EEF6FF] dark:to-[#2375F3]">
            {ordinal}
          </div>

          <h3 className=" text-center text-2xl leading-8 text-[#1A3B8E]/80 dark:text-white">
            {text}
          </h3>
        </div>
      </div>
      {ordinal !== 'Fourth' && (
        <>
          <StepArrowHorizontal className="hidden lg:block" />
          <StepArrowVertical className="lg:hidden" />
        </>
      )}
    </>
  );
}

export default StepCard;

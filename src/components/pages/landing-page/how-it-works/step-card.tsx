'use client';
import Image, { StaticImageData } from 'next/image';
import { useTheme } from 'next-themes';
import React, { useEffect, useState } from 'react';

import StepArrowHorizontal from '@/components/icons/step-arrow-horizontal';
import StepArrowVertical from '@/components/icons/step-arrow-vertical';
import { cn } from '@/utils/cn';
import { useParams } from 'next/navigation';

type Props = {
  imageUrl: StaticImageData;
  text: string;
  ordinal: string;


};

function StepCard({ imageUrl, text, ordinal }: Props) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { locale } = useParams();


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
                  : imageUrl.src.slice(0, imageUrl.src.lastIndexOf('.')) +
                  '-light' +
                  imageUrl.src.slice(imageUrl.src.lastIndexOf('.'))
            }
            alt={text}
            fill
            sizes='w-100%'
            className="object-cover"
            // className={`${(ordinal !== 'Third') ? "object-cover" : "object-contain"} rounded-lg overflow-hidden`}
            quality={100}
          />
        </div>

        <div className="flex flex-col space-y-2 p-6">
          <div className="bg-linear-to-r from-[#145FF2] to-[#BDDDFF] bg-clip-text font-inter text-sm font-medium text-transparent dark:from-[#EEF6FF] dark:to-[#2375F3]">
            {ordinal}
          </div>

          <h3 className=" text-center text-xl sm:text-2xl leading-8 text-[#1A3B8E]/80 dark:text-white">
            {text}
          </h3>
        </div>
      </div>
      {(ordinal !== 'Fourth' && ordinal !== "رابعًا") && (
        <>
          <StepArrowHorizontal className={`hidden lg:block ${locale === "ar" ? "scale-x-[-1]" : ""}`} />
          <StepArrowVertical className="lg:hidden" />
        </>
      )}
    </>
  );
}

export default StepCard;

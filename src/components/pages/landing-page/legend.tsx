//todo: currently not compatible with medium screens, instead of 30 for length, it should be based on the screen size and the font used
import React from 'react';

import { cn } from '@/utils/cn';

type Props = {
  text: any;
  locale: string;
};

function Legend({ text, locale }: Props) {
  // Split the text into chunks that fit comfortably
  const splitText = (text: string, maxChunkLength: number = 30) => {
    const words = text.split(' ');
    const chunks: string[] = [];
    let currentChunk = '';

    for (const word of words) {
      if ((currentChunk + ' ' + word).trim().length <= maxChunkLength) {
        currentChunk = (currentChunk + ' ' + word).trim();
      } else {
        if (currentChunk) chunks.push(currentChunk);
        currentChunk = word;
      }
    }

    if (currentChunk) chunks.push(currentChunk);
    return chunks;
  };

  const textChunks = splitText(text);

  return (
    <>
      <div className="hidden h-8 lg:block">
        <span
          className={cn(
            'h-5 rounded-full  border border-[#145FF2]/20 bg-white/[0.15] bg-linear-to-r from-[#145FF2] to-[#86c1ff] bg-clip-text px-3 py-1 text-center text-sm font-normal uppercase  tracking-[3px] text-transparent shadow-[0_4px_4px_rgba(20,95,242,0.05)] dark:border-white/[0.15] dark:bg-white/[0.05] dark:from-[#EEF6FF] dark:to-[#145FF2]',
            { 'tracking-wider bg-linear-to-l': locale === 'ar' },
          )}
        >
          {text}
        </span>
      </div>
      <div className="flex flex-col items-center justify-center gap-2 lg:hidden">
        {textChunks.map((chunk, index) => (
          <span
            key={index}
            className={cn(
              'h-6 whitespace-nowrap rounded-full border border-[#145FF2]/10 bg-white/[0.15] bg-linear-to-r from-[#145FF2] to-[#BDDDFF] bg-clip-text px-3 py-1 text-center text-xs font-normal uppercase  tracking-[3px] text-transparent shadow-[0_4px_4px_rgba(20,95,242,0.05)] dark:border-white/[0.15] dark:bg-white/[0.05] dark:from-[#EEF6FF] dark:to-[#145FF2]',
              { 'tracking-wider bg-linear-to-l ': locale === 'ar' },
            )}
          >
            {chunk}
          </span>
        ))}
      </div>
    </>
  );
}

export default Legend;

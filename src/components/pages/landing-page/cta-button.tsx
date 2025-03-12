import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { cn } from '@/utils/cn';

type Props = {
  icon: React.ReactNode;
  text: string;
  className?: string;
  iconposition?: 'left' | 'right';
  link?: string;
  newTab?: boolean;
};

function CtaButton({
  icon,
  text,
  link,
  className,
  iconposition = 'left',
  newTab = false,
}: Props) {
  const content = (
    <>
      {iconposition === 'left' && icon}
      {text}
      {iconposition === 'right' && icon}
    </>
  );

  return link ? (
    <Button
      asChild
      className={cn(
        'cursor-pointer h-12 rounded-2xl bg-azure text-xl leading-6 text-white dark:text-white hover:bg-azure/90 dark:bg-linear-to-b dark:from-[#1841B5E5] dark:via-[#0A234D] dark:to-[#1841B5E5] hover:scale-[101%] transition-transform duration-200',
        className
      )}
      style={{
        boxShadow: 'inset 0px 2px 0px #367cd1, inset 0px -1px 0px #0A234D'
      }}
    >
      <Link href={link} target={newTab ? '_blank' : '_self'} rel="noreferrer">
        {content}
      </Link>
    </Button>
  ) : (
    <Button
      className={cn(
        'cursor-pointer h-12 rounded-2xl bg-azure text-xl leading-6 text-white dark:text-white hover:bg-azure/70 dark:bg-linear-to-b dark:from-[#1841B5E5] dark:via-[#0A234D] dark:to-[#1841B5E5] hover:scale-[101%] transition-transform duration-200',
        className
      )}
      style={{
        boxShadow: 'inset 0px 2px 0px #367cd1, inset 0px -1px 0px #0A234D'
      }}
    >
      {content}
    </Button>
  );
}

export default CtaButton;

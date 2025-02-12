import React from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/utils/cn';

type Props = {
  icon: React.ReactNode;
  text: string;
  className?: string;
  iconPosition?: 'left' | 'right';
};

function CtaButton({ icon, text, className, iconPosition = 'left' }: Props) {
  return (
    <Button
      icon={icon}
      className={cn(
        'h-12 rounded-2xl  bg-[#145FF2]  text-xl  leading-6 text-white hover:bg-[#145FF2]/70 transition-colors  duration-200  dark:bg-linear-to-b dark:from-[rgba(24,65,181,0.9)] dark:via-[rgba(10,35,77,0.5)] dark:to-[rgba(24,65,181,0.8)]',
        className,
      )}
      iconPosition={iconPosition}
    >
      {text}
    </Button>
  );
}

export default CtaButton;

import * as React from 'react';

import { cn } from '@/utils/cn';

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<'input'>>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-10 w-full rounded-md border border-neutral-200 bg-transparent px-3 py-1 text-sm sm:text-base shadow-xs transition-colors',
          'file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-neutral-950 placeholder:text-gray-400 focus-visible:outline-hidden',
          'disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:border-azure',
          'dark:file:text-neutral-50 dark:placeholder:text-azure dark:focus-none',
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = 'Input';

export { Input };

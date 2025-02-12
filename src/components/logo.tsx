import NextLink from 'next/link';

import { cn } from '@/utils/cn';

import LogoIcon from './icons/logo';

const Logo = ({
  locale,
  parentDarkMode,
}: {
  locale: string;
  parentDarkMode?: boolean;
}) => {
  return (
    <NextLink className="flex items-center text-white" href={`/${locale}`}>
      <LogoIcon
        className={cn(
          'text-blue-600 hover:text-blue-800 dark:text-white dark:hover:text-gray-400',
          { 'text-white hover:text-gray-400': parentDarkMode },
        )}
      />
    </NextLink>
  );
};

export default Logo;

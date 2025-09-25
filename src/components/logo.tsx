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

  // Always use the same href during SSR to prevent hydration mismatch
  const href = `/${locale}`;

  return (
    <NextLink className="flex items-center text-white" href={href}>
      <LogoIcon
        className={cn(
          'text-blue-600 hover:text-blue-800 dark:hover:text-gray-400',
          { 'text-white hover:text-gray-400': parentDarkMode },
        )}
      />
    </NextLink>
  );
}; export default Logo;

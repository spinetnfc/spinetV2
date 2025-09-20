import NextLink from 'next/link';
import { cn } from '@/utils/cn';
import LogoIcon from './icons/logo';
import { useSafeAuth } from '@/hooks/use-locale';

const Logo = ({
  locale,
  parentDarkMode,
}: {
  locale: string;
  parentDarkMode?: boolean;
}) => {
  const { isAuthenticated, mounted } = useSafeAuth();

  // Always use the same href during SSR to prevent hydration mismatch
  const href = mounted && isAuthenticated ? `/${locale}/app` : `/${locale}`;

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

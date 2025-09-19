import NextLink from 'next/link';
import { cn } from '@/utils/cn';
import LogoIcon from './icons/logo';
import { useIsAuthenticated } from '@/store/auth-store';

const Logo = ({
  locale,
  parentDarkMode,
}: {
  locale: string;
  parentDarkMode?: boolean;
}) => {
  const isAuthenticated = useIsAuthenticated();
  return (
    <NextLink className="flex items-center text-white" href={isAuthenticated ? `/${locale}/app` : `/${locale}`}>
      <LogoIcon
        className={cn(
          'text-blue-600 hover:text-blue-800 dark:hover:text-gray-400',
          { 'text-white hover:text-gray-400': parentDarkMode },
        )}
      />
    </NextLink>
  );
};

export default Logo;

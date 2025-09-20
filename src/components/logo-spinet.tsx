// src/components/logo-spinet.tsx
import NextLink from 'next/link';
import Image from 'next/image';
import { cn } from '@/utils/cn';
import { useSafeAuth } from '@/hooks/use-locale';

const Logo = ({
    locale,
    parentDarkMode,
    asImage = false,
}: {
    locale: string;
    parentDarkMode?: boolean;
    asImage?: boolean;
}) => {
    const { isAuthenticated, mounted } = useSafeAuth();

    const logoImage = (
        <Image
            priority
            src={parentDarkMode ? "/img/logo-spinet-dark.svg" : "/img/logo-spinet.svg"}
            alt="Logo"
            width={160}
            height={160}
            className={cn(
                'text-blue-600 hover:text-blue-800 dark:text-white dark:hover:text-gray-400',
                { 'text-white hover:text-gray-400': parentDarkMode }
            )}
        />
    );

    // If asImage is true, return just the image without link wrapper
    if (asImage) {
        return logoImage;
    }

    // Always use the same href during SSR to prevent hydration mismatch
    const href = mounted && isAuthenticated ? `/${locale}/app` : `/${locale}`;

    return (
        <NextLink className="flex items-center text-white" href={href}>
            {logoImage}
        </NextLink>
    );
};

export default Logo;
// src/components/logo-spinet.tsx
import NextLink from 'next/link';
import Image from 'next/image';
import { cn } from '@/utils/cn';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/authContext';

const Logo = ({
    locale,
    parentDarkMode,
}: {
    locale: string;
    parentDarkMode?: boolean;
}) => {
    // Add state to prevent hydration mismatch
    const [mounted, setMounted] = useState(false);
    const { isAuthenticated } = useAuth();
    // Ensure component is only rendered client-side after mount
    useEffect(() => {
        setMounted(true);
    }, []);

    // Return null or a placeholder during SSR
    if (!mounted) {
        return (
            <NextLink className="flex items-center text-white" href={isAuthenticated ? `/${locale}/app` : `/${locale}`}>
                <Image
                    src={parentDarkMode == true ? "/img/logo-spinet-dark.svg" : "/img/logo-spinet.svg"}
                    alt="Logo"
                    width={160}
                    height={160}
                    className={cn(
                        'text-blue-600 hover:text-blue-800 dark:text-white dark:hover:text-gray-400',
                        { 'text-white hover:text-gray-400': parentDarkMode }
                    )}
                />
            </NextLink>
        );
    }

    return (
        <NextLink className="flex items-center text-white" href={isAuthenticated ? `/${locale}/app` : `/${locale}`}>
            <Image
                src={
                    !parentDarkMode
                        ? '/img/logo-spinet.svg'
                        : '/img/logo-spinet-dark.svg'
                }
                alt="Logo"
                width={160}
                height={160}
                className={cn(
                    'text-blue-600 hover:text-blue-800 dark:text-white dark:hover:text-gray-400',
                    { 'text-white hover:text-gray-400': parentDarkMode }
                )}
            />
        </NextLink>
    );
};

export default Logo;
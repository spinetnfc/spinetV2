// src/components/logo-spinet.tsx
import NextLink from 'next/link';
import Image from 'next/image';
import { cn } from '@/utils/cn';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

const Logo = ({
    locale,
    parentDarkMode,
}: {
    locale: string;
    parentDarkMode?: boolean;
}) => {
    const { resolvedTheme } = useTheme();
    // Add state to prevent hydration mismatch
    const [mounted, setMounted] = useState(false);

    // Ensure component is only rendered client-side after mount
    useEffect(() => {
        setMounted(true);
    }, []);

    // Return null or a placeholder during SSR
    if (!mounted) {
        return (
            <NextLink className="flex items-center text-white" href={`/${locale}`}>
                <Image
                    src="/img/logo-spinet.svg" // Default fallback
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
        <NextLink className="flex items-center text-white" href={`/${locale}`}>
            <Image
                src={
                    resolvedTheme === 'light'
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
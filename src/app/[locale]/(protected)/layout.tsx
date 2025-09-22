'use client';

import { useIsAuthenticated, useAuthLoading } from '@/lib/store/auth/auth-store';
import { useLocale } from '@/hooks/use-locale';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ProtectedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const isAuthenticated = useIsAuthenticated();
    const isLoading = useAuthLoading();
    const router = useRouter();
    const pathname = usePathname();
    const [isClient, setIsClient] = useState(false);

    // Ensure client-side rendering to avoid hydration issues
    useEffect(() => {
        setIsClient(true);
    }, []);

    const locale = useLocale();

    // DEVELOPMENT MODE: Skip auth check
    const SKIP_AUTH = process.env.NEXT_PUBLIC_SKIP_AUTH === 'true';

    useEffect(() => {
        if (SKIP_AUTH) {
            console.log('Protected route bypassed - Development Mode');
            return;
        }

        if (isClient && !isLoading && !isAuthenticated) {
            router.push(`/${locale}/auth/login`);
        }
    }, [isClient, isLoading, isAuthenticated, router, pathname, locale, SKIP_AUTH]);

    // In development mode, always render children
    if (SKIP_AUTH) {
        return <>{children}</>;
    }

    if (!isClient || isLoading || !isAuthenticated) {
        return null; // Prevent rendering until client-side and auth is resolved
    }

    return <>{children}</>;
}
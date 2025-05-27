'use client';

import { useAuth } from '@/context/authContext'; // Corrected import path
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ProtectedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { isAuthenticated, isLoading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [isClient, setIsClient] = useState(false);

    // Ensure client-side rendering to avoid hydration issues
    useEffect(() => {
        setIsClient(true);
    }, []);

    // Get locale safely
    const locale = pathname ? pathname.split('/')[1] || 'en' : 'en';

    useEffect(() => {
        if (isClient && !isLoading && !isAuthenticated) {
            router.push(`/${locale}/auth?redirectTo=${encodeURIComponent(pathname || '')}`);
        }
    }, [isClient, isLoading, isAuthenticated, router, pathname, locale]);

    if (!isClient || isLoading || !isAuthenticated) {
        return null; // Prevent rendering until client-side and auth is resolved
    }

    return <>{children}</>;
}
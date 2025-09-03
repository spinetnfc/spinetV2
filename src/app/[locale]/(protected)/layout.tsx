'use client';

import { useAuth } from '@/context/authContext'; // Corrected import path
import { ContactsProvider } from '@/context/contactsContext';
import { getLocale } from '@/utils/getClientLocale';
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

    const locale = getLocale() || 'en';

    useEffect(() => {
        if (isClient && !isLoading && !isAuthenticated) {
            router.push(`/${locale}/auth/login`);
        }
    }, [isClient, isLoading, isAuthenticated, router, pathname, locale]);

    if (!isClient || isLoading || !isAuthenticated) {
        return null; // Prevent rendering until client-side and auth is resolved
    }

    return <ContactsProvider>{children}</ContactsProvider>;
}
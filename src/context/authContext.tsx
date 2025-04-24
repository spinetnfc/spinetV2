'use client';

import { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export interface User {
    _id: string;
    email: string;
    fullName: string;
    firstName: string;
    lastName: string;
    birthDate: string;
    gender: string;
    companyName: string;
    activitySector: string;
    position: string;
    phoneNumber: string;
    website: string;
    language: string;
    theme: { color: string };
    Pro: { company: boolean; freeTrail: boolean };
    createdAt: string;
    selectedProfile: string;
    tokens: {
        fileApiToken: string;
        fileApiRefreshToken: string;
    };
}

interface AuthContextType {
    user: User | null;
    login: (user: User) => void;
    logout: () => void;
    isAuthenticated: boolean;
    isLoading: boolean;
}

const defaultContextValue: AuthContextType = {
    user: null,
    login: () => { },
    logout: () => { },
    isAuthenticated: false,
    isLoading: true,
};

const AuthContext = createContext<AuthContextType>(defaultContextValue);

function getUserFromCookie(): User | null {
    const cookie = document.cookie
        .split('; ')
        .find(row => row.startsWith('current-user='));
    if (!cookie) return null;

    try {
        const json = decodeURIComponent(cookie.split('=')[1]);
        return JSON.parse(json);
    } catch (err) {
        console.error('Error parsing current-user cookie:', err);
        return null;
    }
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    const getLocale = useMemo(() => {
        const supportedLocales = ['fr', 'ar', 'en'];

        return () => {
            if (!pathname) return 'en';
            const parts = pathname.split('/');
            const localeCandidate = parts[1];

            return supportedLocales.includes(localeCandidate) ? localeCandidate : 'en';
        };
    }, [pathname]);


    // 1) Hydrate user from cookie
    useEffect(() => {
        const userFromCookie = getUserFromCookie();
        if (userFromCookie) {
            setUser(userFromCookie);
        }
        setIsLoading(false);
    }, []);

    // 2) login
    const login = (userData: User) => {
        setUser(userData);
        document.cookie = `current-user=${encodeURIComponent(
            JSON.stringify(userData)
        )}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;

        const locale = getLocale();
        window.location.href = `/${locale}`;
    };

    // 3) logout
    const logout = () => {
        setUser(null);
        document.cookie = `current-user=; path=/; max-age=0; SameSite=Lax`;

        const locale = getLocale();
        window.location.href = `/${locale}/auth/login`;
    };

    const isAuthenticated = !!user;

    const contextValue = useMemo(
        () => ({ user, login, logout, isAuthenticated, isLoading }),
        [user, isAuthenticated, isLoading]
    );

    return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
};

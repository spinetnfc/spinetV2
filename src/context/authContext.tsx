'use client';

import { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { signOut, refreshToken } from '@/lib/api/auth';

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
    refreshUserToken: () => Promise<boolean>;
}

const defaultContextValue: AuthContextType = {
    user: null,
    login: () => { },
    logout: () => { },
    isAuthenticated: false,
    isLoading: true,
    refreshUserToken: async () => false,
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
        // Clear all authentication-related cookies
        document.cookie = `current-user=; path=/; max-age=0; SameSite=Lax`;
        document.cookie = `fileApiToken=; path=/; max-age=0; SameSite=Lax`;
        document.cookie = `fileApiRefreshToken=; path=/; max-age=0; SameSite=Lax`;
        //can't delete cause it's http only, mus tbe done on server side
        // document.cookie = `spinet-session=; path=/; max-age=0; SameSite=Lax`;
        // document.cookie = `sounet-session-sig=; path=/; max-age=0; SameSite=Lax`;
        signOut();
        const locale = getLocale();
        window.location.href = `/${locale}/auth/login`;
    };

    // 4) refresh token
    const refreshUserToken = async (): Promise<boolean> => {
        try {
            const result = await refreshToken();
            console.log('Token refreshed:', result);
            return true;
        } catch (error: any) {
            console.error('Failed to refresh token:', error);

            // If token is invalid, log the user out
            if (error.response?.status === 406) {
                logout();
            }

            return false;
        }
    };

    // Set up automatic token refresh
    useEffect(() => {
        if (!user) return;

        // Refresh token every 30 minutes
        const refreshInterval = setInterval(async () => {
            await refreshUserToken();
        }, 30 * 60 * 1000);

        return () => clearInterval(refreshInterval);
    }, [user]);

    const isAuthenticated = !!user;

    const contextValue = useMemo(
        () => ({ user, login, logout, isAuthenticated, isLoading, refreshUserToken }),
        [user, isAuthenticated, isLoading]
    );

    return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
};

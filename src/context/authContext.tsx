'use client';

import { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface User {
    id: string;
    email: string;
    name?: string;
    // Add other user fields as per your backend
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (token: string, user: User) => void;
    logout: () => void;
    isAuthenticated: boolean;
    isLoading: boolean;
}

// Default values to prevent hydration mismatches
const defaultContextValue: AuthContextType = {
    user: null,
    token: "mock-token",
    login: () => { },
    logout: () => { },
    isAuthenticated: false,
    isLoading: true
};

const AuthContext = createContext<AuthContextType>(defaultContextValue);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    // Server-safe state defaults
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isMounted, setIsMounted] = useState(false);

    const router = useRouter();
    const pathname = usePathname();

    // Track client-side mounting
    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Load auth state from cookies only on client-side
    useEffect(() => {
        if (!isMounted) return;

        const loadUserFromCookies = () => {
            try {
                // Only run in browser environment
                if (typeof document === 'undefined') return;

                const cookies = document.cookie.split('; ').reduce<Record<string, string>>((acc, cookie) => {
                    if (!cookie) return acc;
                    const [name, value] = cookie.split('=');
                    if (name && value) acc[name] = value;
                    return acc;
                }, {});

                const storedToken = cookies['token'];

                if (storedToken) {
                    setToken(storedToken);
                    fetchUser(storedToken);
                } else {
                    setIsLoading(false);
                }
            } catch (error) {
                console.error('Error loading auth state from cookies:', error);
                setIsLoading(false);
            }
        };

        loadUserFromCookies();
    }, [isMounted]);

    // Safe function to get the current locale from the pathname
    const getLocale = useMemo(() => {
        return () => {
            if (!pathname) return 'en';
            const parts = pathname.split('/');
            return parts.length > 1 ? parts[1] : 'en';
        };
    }, [pathname]);

    const fetchUser = async (authToken: string) => {
        if (!isMounted) return;

        setIsLoading(true);
        try {
            // Mock user response for development
            // In production, you would fetch the user from your API
            setTimeout(() => {
                const mockUser: User = {
                    id: '1',
                    email: 'user@example.com',
                    name: 'Demo User'
                };

                setUser(mockUser);
                setIsLoading(false);
            }, 500);
        } catch (error) {
            console.error('Error fetching user:', error);
            setToken(null);
            setUser(null);
            setIsLoading(false);
        }
    };

    const login = (newToken: string, userData: User) => {
        if (!isMounted) return;

        setToken(newToken);
        setUser(userData);
        setIsLoading(false);

        // Set cookie (client-side)
        document.cookie = `token=${newToken}; path=/; max-age=3600; secure; samesite=strict`;

        const locale = getLocale();
        router.push(`/${locale}/app`);
    };

    const logout = () => {
        if (!isMounted) return;

        setToken(null);
        setUser(null);
        setIsLoading(false);

        // Clear cookie
        document.cookie = 'token=; path=/; max-age=0';

        const locale = getLocale();
        router.push(`/${locale}/auth/login`);
    };

    // Derive authentication state
    const isAuthenticated = !!token && !!user;

    // Create a consistent value object to prevent unnecessary re-renders
    const contextValue = useMemo(() => ({
        user,
        token,
        login,
        logout,
        isAuthenticated,
        isLoading
    }), [user, token, isAuthenticated, isLoading]);

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
'use client';

import { createContext, useContext, useEffect, useState } from 'react';
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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const router = useRouter();
    const pathname = usePathname();

    // Load token from cookies on mount
    useEffect(() => {
        // Check cookies client-side (cookies are accessible via document.cookie)
        const cookies = document.cookie.split('; ').reduce((acc, cookie) => {
            const [name, value] = cookie.split('=');
            acc[name] = value;
            return acc;
        }, {} as Record<string, string>);
        const storedToken = cookies['token'];

        if (storedToken) {
            setToken(storedToken);
            fetchUser(storedToken);
        }
    }, []);

    const fetchUser = async (token: string) => {
        try {
            const res = await fetch('http://your-backend/api/user', {
                headers: { Authorization: `Bearer ${token}` },
                credentials: 'include',
            });
            if (res.ok) {
                const userData: User = await res.json();
                setUser(userData);
            } else {
                logout();
            }
        } catch {
            logout();
        }
    };

    const login = (newToken: string, userData: User) => {
        setToken(newToken);
        setUser(userData);
        // Set cookie (client-side; backend should also set HttpOnly cookie)
        document.cookie = `token=${newToken}; path=/; max-age=3600; secure; samesite=strict`;
        router.push(getLocalePath(pathname, '/app'));
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        document.cookie = 'token=; path=/; max-age=0'; // Clear cookie
        router.push(getLocalePath(pathname, '/auth'));
    };

    const isAuthenticated = !!token && !!user;

    // Protect routes client-side
    useEffect(() => {
        const publicRoutes = ['/', '/auth', '/public-profile', '/download-app'];
        const locale = pathname.split('/')[1];
        const routePath = pathname.replace(`/${locale}`, '') || '/';
        const isPublicRoute = publicRoutes.includes(routePath);

        if (!isAuthenticated && !isPublicRoute) {
            router.push(getLocalePath(pathname, '/auth'));
        }
    }, [pathname, isAuthenticated]);

    // Helper to preserve locale in redirects
    const getLocalePath = (currentPath: string, target: string) => {
        const locale = currentPath.split('/')[1];
        return `/${locale}${target}`;
    };

    return (
        <AuthContext.Provider
            value={{ user, token, login, logout, isAuthenticated }}
        >
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
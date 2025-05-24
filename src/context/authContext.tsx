"use client";

import {
    createContext,
    useContext,
    useEffect,
    useState,
    useMemo,
    useCallback,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import { signOut, refreshToken } from "@/lib/api/auth";
import type { User } from '@/types/user';

interface AuthContextType {
    user: User | null;
    login: (user: User) => void;
    logout: () => Promise<void>;
    isAuthenticated: boolean;
    isLoading: boolean;
    refreshUserToken: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | null>(null);

function setSecureCookie(name: string, value: string, maxAge: number) {
    document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; SameSite=Lax${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`;
}

function clearCookie(name: string) {
    document.cookie = `${name}=; path=/; max-age=0; SameSite=Lax`;
}

interface RefreshTokenResponse {
    user: User;
    message: string;
}

export function AuthProvider({
    children,
    initialUser = null,
}: {
    children: React.ReactNode;
    initialUser?: User | null;
}) {
    const [user, setUser] = useState<User | null>(initialUser);
    const [isLoading, setIsLoading] = useState(!initialUser);
    const router = useRouter();
    const pathname = usePathname();

    const getLocale = useCallback(() => {
        const parts = pathname?.split("/") || [];
        return ["fr", "ar", "en"].includes(parts[1]) ? parts[1] : "en";
    }, [pathname]);

    useEffect(() => {
        if (initialUser) return;

        try {
            const cookie = document.cookie
                .split("; ")
                .find((row) => row.startsWith("current-user="));

            if (cookie) {
                const userData = JSON.parse(decodeURIComponent(cookie.split("=")[1]));
                setUser(userData);
            }
        } catch (err) {
            console.error("Error reading user cookie:", err);
        } finally {
            setIsLoading(false);
        }
    }, [initialUser]);

    const login = useCallback((userData: User) => {
        setUser(userData);

        // Set session cookie
        setSecureCookie('spinet-session', userData._id, 60 * 60 * 24 * 7);

        // Set user data
        setSecureCookie(
            'current-user',
            JSON.stringify(userData),
            60 * 60 * 24 * 7
        );

        // Set API tokens
        setSecureCookie(
            'fileApiToken',
            userData.tokens.fileApiToken,
            60 * 60 * 24 * 7
        );
        setSecureCookie(
            'fileApiRefreshToken',
            userData.tokens.fileApiRefreshToken,
            60 * 60 * 24 * 7
        );

        router.refresh();
        router.push(`/${getLocale()}`);
    }, [router, getLocale]);

    const logout = useCallback(async () => {
        try {
            await signOut();
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            setUser(null);

            clearCookie('spinet-session');
            clearCookie('current-user');
            clearCookie('fileApiToken');
            clearCookie('fileApiRefreshToken');

            router.refresh();
            router.push(`/${getLocale()}/auth/login`);
        }
    }, [router, getLocale]);

    const refreshUserToken = useCallback(async (): Promise<boolean> => {
        try {
            const result = await refreshToken() as RefreshTokenResponse;
            if (result.user) {
                setUser(result.user);

                setSecureCookie(
                    'fileApiToken',
                    result.user.tokens.fileApiToken,
                    60 * 60 * 24 * 7
                );
                setSecureCookie(
                    'fileApiRefreshToken',
                    result.user.tokens.fileApiRefreshToken,
                    60 * 60 * 24 * 7
                );

                return true;
            }
            return false;
        } catch (error: any) {
            console.error("Token refresh failed:", error);
            if (error.response?.status === 401) {
                logout();
            }
            return false;
        }
    }, [logout]);

    useEffect(() => {
        if (!user) return;

        let refreshTimeout: NodeJS.Timeout;

        const scheduleRefresh = () => {
            refreshTimeout = setTimeout(refreshUserToken, 55 * 60 * 1000); // 55 minutes
        };

        scheduleRefresh();

        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                refreshUserToken();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            clearTimeout(refreshTimeout);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [user, refreshUserToken]);

    const contextValue = useMemo(
        () => ({
            user,
            login,
            logout,
            isAuthenticated: !!user,
            isLoading,
            refreshUserToken,
        }),
        [user, login, logout, isLoading, refreshUserToken]
    );

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    return context;
}
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
        setIsLoading(true);
        const currentLocale = getLocale();

        try {
            // First clear all auth state
            setUser(null);
            clearCookie('spinet-session');
            clearCookie('current-user');
            clearCookie('fileApiToken');
            clearCookie('fileApiRefreshToken');

            // Then notify the server
            await signOut();

            // Force a full page reload to clear all client state
            window.location.href = `/${currentLocale}`;
        } catch (error) {
            console.error("Logout error:", error);
            // Even if the server logout fails, we still want to clear local state
            window.location.href = `/${currentLocale}`;
        } finally {
            setIsLoading(false);
        }
    }, [getLocale]);

    const refreshUserToken = useCallback(async (retryCount = 3, delay = 1000): Promise<boolean> => {
        for (let i = 0; i < retryCount; i++) {
            try {
                const result = await refreshToken();
                if (result.message === "token refreshed") {
                    console.log("Token refreshed successfully");
                    return true;
                }
                console.log("Token refresh failed:", result);
                return false;
            } catch (error: any) {
                if (i === retryCount - 1) {
                    console.error("Token refresh failed after all retries:", error);
                    logout();
                    return false;
                }
                console.warn(`Token refresh attempt ${i + 1} failed, retrying in ${delay}ms:`, error);
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
        return false;
    }, [logout]);

    useEffect(() => {
        if (!user) return;

        let refreshTimeout: NodeJS.Timeout;
        let retryCount = 0;
        const MAX_RETRIES = 3;
        const REFRESH_INTERVAL = 23 * 60 * 60 * 1000; //23h

        const scheduleRefresh = (interval: number) => {
            refreshTimeout = setTimeout(async () => {
                const success = await refreshUserToken();
                if (success) {
                    retryCount = 0;
                    scheduleRefresh(REFRESH_INTERVAL);
                } else if (retryCount < MAX_RETRIES) {
                    retryCount++;
                    const backoffInterval = interval * Math.pow(2, retryCount);
                    console.warn(`Scheduling retry ${retryCount} in ${backoffInterval}ms`);
                    scheduleRefresh(backoffInterval);
                }
            }, interval);
        };

        // Initial schedule
        scheduleRefresh(REFRESH_INTERVAL);

        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                refreshUserToken().then(success => {
                    if (success) {
                        clearTimeout(refreshTimeout);
                        retryCount = 0;
                        scheduleRefresh(REFRESH_INTERVAL);
                    }
                });
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
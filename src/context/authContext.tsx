"use client";

import {
    createContext,
    useContext,
    useEffect,
    useState,
    useMemo,
    useCallback,
    useRef,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import { signOut, refreshToken } from "@/lib/api/auth";
import { getUserFromCookie } from "@/utils/cookie";

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

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();
    const localeRef = useRef<string>("en"); // cache locale

    // compute locale when pathname changes
    useEffect(() => {
        const supportedLocales = ["fr", "ar", "en"];
        const parts = pathname?.split("/") || [];
        const localeCandidate = parts[1] || "en";
        localeRef.current = supportedLocales.includes(localeCandidate)
            ? localeCandidate
            : "en";
    }, [pathname]);

    // hydrate user from cookie
    useEffect(() => {
        const userFromCookie = getUserFromCookie();
        setUser(userFromCookie);
        setIsLoading(false);
        // clear cache on unmount to ensure fresh cookie read on next load
        return () => {
            (getUserFromCookie as any).cache = null;
        };
    }, []);

    const login = useCallback((userData: User) => {
        setUser(userData);
        document.cookie = `current-user=${encodeURIComponent(
            JSON.stringify(userData)
        )}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
        (getUserFromCookie as any).cache = userData; // Update cache
        router.push(`/${localeRef.current}`);
    }, [router]);

    const logout = useCallback(async () => {
        setUser(null);
        document.cookie = `current-user=; path=/; max-age=0; SameSite=Lax`;
        document.cookie = `fileApiToken=; path=/; max-age=0; SameSite=Lax`;
        document.cookie = `fileApiRefreshToken=; path=/; max-age=0; SameSite=Lax`;
        (getUserFromCookie as any).cache = null; // Clear cache
        try {
            await signOut();
        } finally {
            router.push(`/${localeRef.current}/auth/login`);
        }
    }, [router]);

    const refreshUserToken = useCallback(async (): Promise<boolean> => {
        try {
            const result = await refreshToken();
            console.log("Token refreshed:", result);
            return true;
        } catch (error: any) {
            console.error("Failed to refresh token:", error);
            if (error.response?.status === 406) {
                logout();
            }
            return false;
        }
    }, [logout]);

    // ttoken refresh on focus or navigation
    useEffect(() => {
        if (!user) return;

        const handleFocus = () => refreshUserToken();
        window.addEventListener("focus", handleFocus);

        // refresh on navigation (optional, depending on needs)
        const handleRouteChange = () => refreshUserToken();

        // fallback interval for long sessions 23hrs
        const refreshInterval = setInterval(refreshUserToken, 23 * 60 * 60 * 1000);

        return () => {
            window.removeEventListener("focus", handleFocus);
            clearInterval(refreshInterval);
        };
    }, [user, refreshUserToken]);

    const isAuthenticated = !!user;

    // memoized context value
    const contextValue = useMemo(
        () => ({
            user,
            login,
            logout,
            isAuthenticated,
            isLoading,
            refreshUserToken,
        }),
        [user, isAuthenticated, isLoading, login, logout, refreshUserToken]
    );

    return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
};
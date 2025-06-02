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
import type { User } from "@/types/user";
import { useGoogleLogin } from "@react-oauth/google";
import { api } from "@/lib/axios";
import axios from "axios";
// Define a default user to avoid null
const defaultUser: User = {
    _id: "",
    email: "",
    fullName: "",
    firstName: "",
    lastName: "",
    birthDate: "",
    gender: "",
    companyName: "",
    activitySector: "",
    position: "",
    phoneNumber: "",
    website: "",
    language: "",
    theme: { color: "" },
    Pro: { company: true, freeTrail: true },
    createdAt: "",
    selectedProfile: "",
    tokens: {
        fileApiToken: "",
        fileApiRefreshToken: ""
    }
};

interface AuthContextType {
    user: User;
    login: (user: User) => void;
    googleLogin: () => void;
    logout: () => void;
    isAuthenticated: boolean;
    isLoading: boolean;
    refreshUserToken: () => Promise<boolean>;
}

const defaultContextValue: AuthContextType = {
    user: defaultUser,
    login: () => { },
    googleLogin: () => { },
    logout: () => { },
    isAuthenticated: false,
    isLoading: true,
    refreshUserToken: async () => false,
};

const AuthContext = createContext<AuthContextType>(defaultContextValue);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User>(defaultUser);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();
    const localeRef = useRef<string>("en");

    // Compute locale when pathname changes
    useEffect(() => {
        const supportedLocales = ["fr", "ar", "en"];
        const parts = pathname?.split("/") || [];
        const localeCandidate = parts[1] || "en";
        localeRef.current = supportedLocales.includes(localeCandidate)
            ? localeCandidate
            : "en";
    }, [pathname]);

    // Hydrate user from cookie and handle initial state
    useEffect(() => {
        const userFromCookie = getUserFromCookie();
        if (!userFromCookie) {
            // Just set the default user and loading state without redirecting
            setUser(defaultUser);
            setIsLoading(false);
        } else {
            setUser(userFromCookie);
            setIsLoading(false);
        }
        // Clear cache on unmount
        return () => {
            (getUserFromCookie as any).cache = null;
        };
    }, []);

    const login = useCallback((userData: User) => {
        setUser(userData);
        document.cookie = `current-user=${encodeURIComponent(
            JSON.stringify(userData)
        )}; path=/; SameSite=Lax`; {/*max-age=${60 * 60 * 24 * 7};*/ }
        if (userData.googleId) {
            document.cookie = `googleId=${userData.googleId}; path=/; SameSite=Lax; Secure`;
        }
        (getUserFromCookie as any).cache = userData;
        router.push(`/${localeRef.current}`);
    }, [router]);

    const googleLogin = useGoogleLogin({
        scope: 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email',
        onSuccess: async (tokenResponse) => {
            try {
                // Step 1: Get Google profile
                const { data: googleUser } = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
                    headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
                });

                // Step 2: Prepare user data
                const userData = {
                    googleId: googleUser.sub,
                    email: googleUser.email || 'unknown@example.com',
                    firstName: googleUser.given_name || 'alpha',
                    lastName: googleUser.family_name || 'sigma',
                };

                // Step 3: Send to backend using your `api` instance
                const res = await api.post('/auth/signup', userData, { withCredentials: true });

                // Step 4: Handle response
                const data = res.data;
                console.log('Full signup response:', data);
                login(data);

            } catch (error) {
                console.error('Google login error:', error);
            }
        },
        onError: (error: any) => {
            console.error('Google login error:', error);
        },
    });


    const logout = useCallback(async (shouldRedirect: boolean = true) => {
        try {
            setUser(defaultUser);
            document.cookie = `current-user=; path=/; max-age=0; SameSite=Lax`;
            // document.cookie = `fileApiToken=; path=/; max-age=0; SameSite=Lax`;
            // document.cookie = `fileApiRefreshToken=; path=/; max-age=0; SameSite=Lax`;
            (getUserFromCookie as any).cache = null;
            await signOut();
        } finally {
            if (shouldRedirect) {
                router.push(`/${localeRef.current}/auth/login`);
            }
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

    // Token refresh on focus or navigation
    useEffect(() => {
        if (user._id === "") return; // Skip if default user (not authenticated)

        const handleFocus = () => refreshUserToken();
        window.addEventListener("focus", handleFocus);

        const refreshInterval = setInterval(refreshUserToken, 23 * 60 * 60 * 1000);

        return () => {
            window.removeEventListener("focus", handleFocus);
            clearInterval(refreshInterval);
        };
    }, [user, refreshUserToken]);

    const isAuthenticated = user._id !== ""; // Check if not default user

    const contextValue = useMemo(
        () => ({
            user,
            login,
            googleLogin,
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
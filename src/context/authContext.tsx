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
import { toast } from "sonner";
// default user to avoid null case
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
// type for the facebook login function
// type LoginFunc = (data: any) => void;

interface AuthContextType {
    user: User;
    login: (user: User) => void;
    googleLogin: () => void;
    facebookLogin: () => void;
    appleLogin: () => void;
    logout: () => void;
    isAuthenticated: boolean;
    isLoading: boolean;
    refreshUserToken: () => Promise<boolean>;
}

const defaultContextValue: AuthContextType = {
    user: defaultUser,
    login: () => { },
    googleLogin: () => { },
    facebookLogin: () => { },
    appleLogin: () => { },
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
        (getUserFromCookie as any).cache = userData;
        // router.push(`/${localeRef.current}`);
    }, [router]);

    // google login
    const googleLogin = useGoogleLogin({
        scope: 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email',
        onSuccess: async (tokenResponse) => {
            try {
                // get Google profile
                const { data: googleUser } = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
                    headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
                });

                const userData = {
                    googleId: googleUser.sub,
                    email: googleUser.email || 'unknown@example.com',
                    firstName: googleUser.given_name || 'alpha',
                    lastName: googleUser.family_name || 'sigma',
                };

                const res = await api.post('/auth/signup', userData, { withCredentials: true });

                const data = res.data;
                console.log('Full signup response:', data);
                login(data);
                router.push(`/${localeRef.current}`);


            } catch (error) {
                console.error('Google login error:', error);
            }
        },
        onError: (error: any) => {
            console.error('Google login error:', error);
        },
    });

    // facebook login 
    const facebookLogin = () => {
        if (!window.FB) {
            console.error("Facebook SDK not loaded");
            return;
        }

        window.FB.login(
            (response: any) => {
                if (response.authResponse) {
                    window.FB.api(
                        "/me",
                        { fields: "id,email,first_name,last_name" },
                        async (userInfo: any) => {
                            if (userInfo.error) {
                                console.error("Error fetching user info:", userInfo.error);
                                return;
                            }

                            const userData = {
                                facebookId: userInfo.id,
                                email: userInfo.email || "unknown@example.com",
                                firstName: userInfo.first_name || "alpha",
                                lastName: userInfo.last_name || "sigma",
                            };

                            try {
                                const res = await axios.post(
                                    "https://api.spinet.app/auth/signup",
                                    userData,
                                    { withCredentials: true }
                                );
                                login(res.data);
                                router.push(`/${localeRef.current}`);

                            } catch (error) {
                                console.error("Backend signup error:", error);
                            }
                        }
                    );
                } else {
                    console.error("User cancelled login or did not authorize.");
                }
            },
            { scope: "email,public_profile" }
        );
    };

    // apple login
    useEffect(() => {
        if (typeof window !== "undefined" && (window as any).AppleID) {
            (window as any).AppleID.auth.init({
                clientId: process.env.NEXT_PUBLIC_APPLE_CLIENT_ID || "",
                scope: process.env.NEXT_PUBLIC_APPLE_SCOPE || "",
                redirectURI: process.env.NEXT_PUBLIC_APPLE_REDIRECT_URI || "",
                usePopup: true,
            });
        }
    }, []);

    // Apple login function
    const appleLogin = async () => {
        try {
            const AppleID = (window as any).AppleID;
            if (!AppleID) {
                console.error("AppleID SDK not loaded");
                return;
            }

            const response = await AppleID.auth.signIn();

            const { id_token, user } = response.authorization;

            // Decode id_token JWT payload (simplified base64 decode)
            const base64Url = id_token.split(".")[1];
            const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
            const jsonPayload = decodeURIComponent(
                atob(base64)
                    .split("")
                    .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
                    .join("")
            );
            const payload = JSON.parse(jsonPayload);

            const userData = {
                appleId: payload.sub,
                email: payload.email || (user && user.email) || "unknown@example.com",
                firstName: user?.name?.firstName || "Unknown",
                lastName: user?.name?.lastName || "User",
            };

            const res = await api.post("/auth/signup", userData, { withCredentials: true });

            login(res.data);
            router.push(`/${localeRef.current}`);

        } catch (error) {
            console.error("Apple login error:", error);
        }
    };

    const logout = useCallback(async (shouldRedirect: boolean = true) => {
        try {
            setUser(defaultUser);
            document.cookie = `current-user=; path=/; max-age=0; SameSite=Lax`;
            (getUserFromCookie as any).cache = null;
            const response = await signOut();
            console.log("Logout response:", response);
        } catch (error: any) {
            console.error("Logout error:", error);
            await new Promise((resolve) => setTimeout(resolve, 20000));
        } finally {
            if (shouldRedirect) {
                router.push(`/${localeRef.current}/auth/login`);
            }
        }
    }, [router]);

    const refreshUserToken = useCallback(async (): Promise<boolean> => {
        try {
            const response = await refreshToken();
            console.log("Token refreshed:", response);
            return true;
        } catch (error: any) {
            console.error("Failed to refresh token:", error);
            if (error.response?.status === 406) {
                logout();
            }
            return false;
        }
    }, [logout]);
    const isAuthenticated = user._id !== ""; // check if not default user

    // token refresh on focus or navigation
    useEffect(() => {
        if (!isAuthenticated) return;

        const handleFocus = () => refreshUserToken();
        window.addEventListener("focus", handleFocus);

        const refreshInterval = setInterval(refreshUserToken, 23 * 60 * 60 * 1000);

        return () => {
            window.removeEventListener("focus", handleFocus);
            clearInterval(refreshInterval);
        };
    }, [user, refreshUserToken]);


    const contextValue = useMemo(
        () => ({
            user,
            login,
            googleLogin,
            facebookLogin,
            appleLogin,
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
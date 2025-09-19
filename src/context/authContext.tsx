"use client";

import {
    createContext,
    useContext,
    useState,
    useMemo,
} from "react";
import type { User } from "@/types/user";
// Mock user for frontend development
const mockUser: User = {
    _id: "mock-user-123",
    email: "demo@spinet.com",
    fullName: "Demo User",
    firstName: "Demo",
    lastName: "User",
    birthDate: "1990-01-01",
    gender: "other",
    companyName: "Spinet Demo",
    activitySector: "Technology",
    position: "Frontend Developer",
    phoneNumber: "+1234567890",
    website: "https://demo.spinet.com",
    language: "en",
    theme: { color: "blue" },
    Pro: { company: true, freeTrial: true },
    createdAt: new Date().toISOString(),
    selectedProfile: "mock-profile-123",
    tokens: {
        fileApiToken: "mock-token",
        fileApiRefreshToken: "mock-refresh-token"
    }
};

interface AuthContextType {
    user: User;
    login: (user: User) => void;
    logout: () => void;
    isAuthenticated: boolean;
    isCompany: boolean;
    isPro: boolean;
    isLoading: boolean;
}

const defaultContextValue: AuthContextType = {
    user: mockUser,
    login: () => { },
    logout: () => { },
    isAuthenticated: true,
    isCompany: true,
    isPro: true,
    isLoading: false,
};

const AuthContext = createContext<AuthContextType>(defaultContextValue);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User>(mockUser);
    const [isLoading] = useState(false);

    const login = (userData: User) => {
        setUser(userData);
    };

    const logout = () => {
        // For development, just keep the mock user
        console.log('Logout called - staying with mock user for development');
    };

    const isAuthenticated = true; // Always authenticated in dev mode
    const isCompany = user.Pro?.company || false;
    const isPro = (user.Pro?.freeTrial || user.Pro?.expiresAt) ? true : false;

    const contextValue = useMemo(
        () => ({
            user,
            login,
            logout,
            isAuthenticated,
            isCompany,
            isPro,
            isLoading,
        }),
        [user, isAuthenticated, isCompany, isPro, isLoading]
    );

    return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
};
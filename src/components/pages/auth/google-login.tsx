'use client';
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import GoogleIcon from '@/components/icons/google-icon';

interface User {
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

export default function GoogleSignIn() {
    const [user, setUser] = useState<User | null>(null);

    const login = useGoogleLogin({
        scope: 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email',
        onSuccess: async (tokenResponse) => {
            try {
                // Fetch Google user info
                const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                    headers: { Authorization: `Bearer ${tokenResponse.access_token} ` },
                });
                if (!response.ok) throw new Error(`Google API error: ${response.statusText} `);
                const googleUser = await response.json();

                // Prepare data for backend
                const userData = {
                    googleId: googleUser.sub, // Google user ID
                    email: googleUser.email || 'unknown@example.com',
                    firstName: googleUser.given_name || 'alpha',
                    lastName: googleUser.family_name || 'sigma',
                };

                // Send to /auth/signup
                const res = await fetch('https://api.spinet.app/auth/signup', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(userData),
                });
                if (!res.ok) throw new Error(`Backend error: ${res.statusText} `);
                const data: User = await res.json();
                setUser(data);
                console.log('Login successful:', data);

                // Set cookies
                document.cookie = `current - user=${encodeURIComponent(JSON.stringify(data))}; path =/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
                document.cookie = `fileApiToken=${encodeURIComponent(data.tokens.fileApiToken)}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
                document.cookie = `fileApiRefreshToken=${encodeURIComponent(data.tokens.fileApiRefreshToken)}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
            } catch (error) {
                console.error('Error:', error);
            }
        },
        onError: (error) => console.error('Google login error:', error),
    });

    const logout = () => {
        googleLogout();
        setUser(null);
        document.cookie = `current-user=; path=/; max-age=0; SameSite=Lax`;
        document.cookie = `fileApiToken=; path=/; max-age=0; SameSite=Lax`;
        document.cookie = `fileApiRefreshToken=; path=/; max-age=0; SameSite=Lax`;
    };

    return (
        <div className="z-50 w-full space-y-6 rounded-lg p-8 text-[#0D2C60] shadow-md dark:text-[#EEF6FF] lg:bg-white lg:dark:bg-[#010E37]">
            {user ? (
                <div className="flex flex-col items-center space-y-4">
                    <p className="text-start text-lg">Welcome, {user.fullName}</p>
                    <Button
                        variant="outline"
                        onClick={logout}
                        className="w-full max-w-xs rounded-3xl border-gray-200 dark:border-blue-900 bg-neutral-100 dark:bg-navy px-4 py-2 transition-colors duration-300 hover:bg-gray-200 dark:hover:bg-navy/80"
                    >
                        Sign Out
                    </Button>
                </div>
            ) : (
                <div className="flex justify-center space-x-4">
                    <Button
                        variant="outline"
                        onClick={() => login()}
                        className="flex items-center gap-2 rounded-3xl border-gray-200 dark:border-blue-900 bg-neutral-100 dark:bg-navy px-4 py-2 transition-colors duration-300 hover:bg-gray-200 dark:hover:bg-navy/80"
                    >
                        <GoogleIcon />
                        Sign in with Google
                    </Button>
                </div>
            )}
        </div>
    );
}
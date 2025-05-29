'use client';
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import { useState } from 'react';

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
        onSuccess: async (tokenResponse) => {
            // Fetch user info from Google
            const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
            });
            const googleUser = await response.json();

            // Prepare data for backend
            const userData = {
                fullName: googleUser.name || 'Unknown User',
                birthDate: googleUser.birthday || '1999-07-08', // Google may not provide birthday
                gender: googleUser.gender || 'unspecified', // Google may not provide gender
                phoneNumber: googleUser.phone_number || 'unknown', // Google may not provide phone
                firstName: googleUser.given_name || 'alpha',
                lastName: googleUser.family_name || 'sigma',
                email: googleUser.email || 'unknown@example.com',
                companyName: 'spinet', // Replace with actual data or prompt user
                activitySector: 'development',
                position: 'web developer',
                website: 'alpha.dz',
                language: 'eng',
                theme: { color: '#FFEE55' },
                Pro: { company: false, freeTrail: false },
                selectedProfile: 'default',
            };

            // Send to backend
            try {
                const res = await fetch('https://api.spinet.app/auth/google', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(userData),
                });
                const data: User = await res.json();
                if (res.ok) {
                    setUser(data);
                    console.log('Login successful:', data);
                } else {
                    console.error('Login failed:', data);
                }
            } catch (error) {
                console.error('Server error:', error);
            }
        },
    });

    const logout = () => {
        googleLogout();
        setUser(null);
    };

    return (
        <div className="z-50 w-full space-y-6 rounded-lg p-8 text-[#0D2C60] shadow-md dark:text-[#EEF6FF] lg:bg-white lg:dark:bg-[#010E37]">
            {user ? (
                <div>
                    <p>Welcome, {user.fullName}</p>
                    <button onClick={logout}>Sign Out</button>
                </div>
            ) : (
                <button onClick={() => login()}>Sign in with Google</button>
            )}
        </div>
    );
}
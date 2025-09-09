"use client";

import {
    createContext,
    useContext,
    useEffect,
    useState,
    useMemo,
    useCallback,
} from "react";
 import type { ProfileData } from "@/types/profile";  
import { useAuth } from "./authContext";  
import { toast } from "sonner";
import { getProfileAction } from "@/actions/profile";

interface ProfileContextType {
    profilesCache: Map<string, ProfileData>; // Cache all profile data
    currentProfileData: ProfileData | null; // Current selected profile data
    profileLoading: boolean;
    profileError: string | null;
    
    // Methods
    getProfileData: (profileId: string | null) => Promise<ProfileData>; // Cached version - REPLACES your getProfileAction
    selectProfile: (profileId: string) => Promise<void>;
    refreshCurrentProfile: () => Promise<void>;
    refreshProfileData: (profileId: string) => Promise<ProfileData>;
    clearProfileCache: () => void;
    preloadProfile: (profileId: string) => Promise<void>; // For preloading profiles
}

const defaultContextValue: ProfileContextType = {
    profilesCache: new Map(),
    currentProfileData: null,
    profileLoading: false,
    profileError: null,
    getProfileData: async () => ({} as ProfileData),
    selectProfile: async () => {},
    refreshCurrentProfile: async () => {},
    refreshProfileData: async () => ({} as ProfileData),
    clearProfileCache: () => {},
    preloadProfile: async () => {},
};

const ProfileContext = createContext<ProfileContextType>(defaultContextValue);

export const ProfileProvider = ({ children }: { children: React.ReactNode }) => {
    const [profilesCache, setProfilesCache] = useState<Map<string, ProfileData>>(new Map());
    const [currentProfileData, setCurrentProfileData] = useState<ProfileData | null>(null);
    const [profileLoading, setProfileLoading] = useState(false);
    const [profileError, setProfileError] = useState<string | null>(null);
    
    const { user, isAuthenticated, login } = useAuth();

    // THIS REPLACES YOUR getProfileAction - Cached profile fetcher with performance optimization
    const getProfileData = useCallback(async (profileId: string | null): Promise<ProfileData> => {
        if (!profileId) {
            throw new Error('Profile ID is required');
        }

        // Check cache first
        if (profilesCache.has(profileId)) {
            console.log('✅ Profile cache HIT for:', profileId);
            return profilesCache.get(profileId)!;
        }

        console.log('⚠️ Profile cache MISS, fetching:', profileId);
        setProfileLoading(true);
        setProfileError(null);
        
        try {
            const profile = await getProfileAction(profileId);
            
            // Cache the result
            setProfilesCache(prev => new Map(prev).set(profileId, profile));
            
            return profile;
        } catch (error: any) {
            const errorMessage = error?.message || 'Failed to fetch profile';
            console.error('❌ Error fetching profile:', error);
            setProfileError(errorMessage);
            throw error;
        } finally {
            setProfileLoading(false);
        }
    }, [profilesCache]);

    // Force refresh a specific profile (removes from cache and refetches)
    const refreshProfileData = useCallback(async (profileId: string): Promise<ProfileData> => {
        console.log('🔄 Force refreshing profile:', profileId);
        
        // Remove from cache to force refresh
        setProfilesCache(prev => {
            const newMap = new Map(prev);
            newMap.delete(profileId);
            return newMap;
        });
        
        return await getProfileData(profileId);
    }, [getProfileData]);

    // Select profile and load its data (updates auth context too)
    const selectProfile = useCallback(async (profileId: string) => {
        try {
            setProfileError(null);
            const profileData = await getProfileData(profileId);
            
            // Update current profile
            setCurrentProfileData(profileData);
            
            // Update user's selectedProfile in auth context
            const updatedUser = { ...user, selectedProfile: profileId };
            login(updatedUser); // This will update the auth context and cookie
            
            console.log('✅ Profile selected:', profileId);
        } catch (error: any) {
            const errorMessage = error?.message || 'Failed to load profile';
            console.error('❌ Failed to select profile:', error);
            setProfileError(errorMessage);
            toast.error(errorMessage);
            throw error;
        }
    }, [user, getProfileData, login]);

    // Refresh current profile data
    const refreshCurrentProfile = useCallback(async () => {
        if (!user.selectedProfile) {
            console.log('⚠️ No selected profile to refresh');
            return;
        }
        
        try {
            console.log('🔄 Refreshing current profile:', user.selectedProfile);
            const profileData = await refreshProfileData(user.selectedProfile);
            setCurrentProfileData(profileData);
        } catch (error) {
            console.error('❌ Failed to refresh current profile:', error);
            setProfileError('Failed to refresh profile');
        }
    }, [user.selectedProfile, refreshProfileData]);

    // Preload a profile (useful for performance optimization)
    const preloadProfile = useCallback(async (profileId: string) => {
        if (profilesCache.has(profileId)) {
            console.log('✅ Profile already cached:', profileId);
            return;
        }
        
        try {
            console.log('⚡ Preloading profile:', profileId);
            await getProfileData(profileId);
        } catch (error) {
            console.error('❌ Failed to preload profile:', profileId, error);
            // Don't throw error for preloading failures
        }
    }, [profilesCache, getProfileData]);

    // Clear all cached profiles
    const clearProfileCache = useCallback(() => {
        console.log('🗑️ Clearing profile cache');
        setProfilesCache(new Map());
        setCurrentProfileData(null);
        setProfileError(null);
    }, []);

    // Load current profile when user changes or selected profile changes
    useEffect(() => {
        if (isAuthenticated && user.selectedProfile) {
            console.log('👤 Loading current profile for user:', user.selectedProfile);
            getProfileData(user.selectedProfile)
                .then(setCurrentProfileData)
                .catch(err => {
                    console.error('❌ Failed to load current profile:', err);
                    setProfileError('Failed to load current profile');
                });
        } else {
            setCurrentProfileData(null);
            setProfileError(null);
        }
    }, [isAuthenticated, user.selectedProfile, getProfileData]);

    // Clear cache when user logs out
    useEffect(() => {
        if (!isAuthenticated) {
            clearProfileCache();
        }
    }, [isAuthenticated, clearProfileCache]);

    // Debug logging for cache state
    useEffect(() => {
        console.log('📊 Profile cache state:', {
            cacheSize: profilesCache.size,
            cachedProfiles: Array.from(profilesCache.keys()),
            currentProfile: user.selectedProfile,
            hasCurrentData: !!currentProfileData
        });
    }, [profilesCache, user.selectedProfile, currentProfileData]);

    const contextValue = useMemo(
        () => ({
            profilesCache,
            currentProfileData,
            profileLoading,
            profileError,
            getProfileData,
            selectProfile,
            refreshCurrentProfile,
            refreshProfileData,
            clearProfileCache,
            preloadProfile,
        }),
        [
            profilesCache,
            currentProfileData,
            profileLoading,
            profileError,
            getProfileData,
            selectProfile,
            refreshCurrentProfile,
            refreshProfileData,
            clearProfileCache,
            preloadProfile,
        ]
    );

    return (
        <ProfileContext.Provider value={contextValue}>
            {children}
        </ProfileContext.Provider>
    );
};

export const useProfiles = () => {
    const ctx = useContext(ProfileContext);
    if (!ctx) {
        throw new Error("useProfiles must be used within ProfileProvider");
    }
    return ctx;
};

// Custom hook for easy profile access (alternative to useProfiles)
export const useCurrentProfile = () => {
    const { currentProfileData, profileLoading, profileError } = useProfiles();
    return { currentProfileData, profileLoading, profileError };
};

// Custom hook for profile management
export const useProfileActions = () => {
    const { 
        getProfileData, 
        selectProfile, 
        refreshCurrentProfile, 
        refreshProfileData,
        preloadProfile,
        clearProfileCache 
    } = useProfiles();
    
    return { 
        getProfileData, 
        selectProfile, 
        refreshCurrentProfile, 
        refreshProfileData,
        preloadProfile,
        clearProfileCache 
    };
};
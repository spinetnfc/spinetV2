import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { ProfileData } from '@/types/profile';
import { mockProfiles } from '@/mockdata/profiles';

type ProfileQuery = string | { profileId: string };

interface ProfileCache {
  profiles: Map<string, ProfileData>;
  loading: Map<string, boolean>;
  errors: Map<string, string>;
  lastFetch: Map<string, number>;
}

interface ProfileState {
  // State
  cache: ProfileCache;
  currentProfileId: string | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  setCurrentProfile: (profileId: string | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  fetchProfile: (query: ProfileQuery) => Promise<ProfileData | null>;
  preloadProfile: (query: ProfileQuery) => Promise<void>;
  getProfile: (query: ProfileQuery) => ProfileData | null;
  invalidateProfile: (query: ProfileQuery) => void;
  clearCache: () => void;
  refreshProfile: (query: ProfileQuery) => Promise<ProfileData | null>;
}

// Helper to create cache key from query
const createCacheKey = (query: ProfileQuery): string => {
  if (typeof query === 'string') {
    return query;
  }
  return `${query.profileId}`;
};

// Cache expiry time (5 minutes)
const CACHE_EXPIRY = 5 * 60 * 1000;

export const useProfileStore = create<ProfileState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        cache: {
          profiles: new Map(),
          loading: new Map(),
          errors: new Map(),
          lastFetch: new Map(),
        },
        currentProfileId: null,
        isLoading: false,
        error: null,

        // Actions
        setCurrentProfile: (profileId: string | null) => {
          set(
            () => ({
              currentProfileId: profileId,
              error: null,
            }),
            false,
            'profile/setCurrentProfile',
          );
        },

        setLoading: (loading: boolean) => {
          set(
            () => ({
              isLoading: loading,
            }),
            false,
            'profile/setLoading',
          );
        },

        setError: (error: string | null) => {
          set(
            () => ({
              error,
            }),
            false,
            'profile/setError',
          );
        },

        getProfile: (query: ProfileQuery) => {
          const { cache } = get();
          const key = createCacheKey(query);

          // Check if cached and not expired
          const lastFetch = cache.lastFetch.get(key);
          const isExpired = lastFetch && Date.now() - lastFetch > CACHE_EXPIRY;

          if (cache.profiles.has(key) && !isExpired) {
            return cache.profiles.get(key) || null;
          }

          return null;
        },

        fetchProfile: async (query: ProfileQuery) => {
          const { cache, setLoading, setError } = get();
          const key = createCacheKey(query);

          // Check if already loading
          if (cache.loading.get(key)) {
            console.log('Profile already loading:', key);
            return null;
          }

          // Check cache first
          const cachedProfile = get().getProfile(query);
          if (cachedProfile) {
            console.log('Profile found in cache:', key);
            return cachedProfile;
          }

          // Set loading state
          set(
            (state) => ({
              cache: {
                ...state.cache,
                loading: new Map(state.cache.loading).set(key, true),
                errors: new Map(state.cache.errors.set(key, '')),
              },
            }),
            false,
            'profile/fetchProfile/start',
          );

          setLoading(true);
          setError(null);

          try {
            // Simulate API delay
            await new Promise((resolve) => setTimeout(resolve, 800));

            // Find profile in mock data
            const profileId =
              typeof query === 'string' ? query : query.profileId;
            let profile = mockProfiles.find((p) => p._id === profileId);

            if (!profile) {
              console.warn(
                `Profile not found: ${profileId}, using fallback profile`,
              );
              // Use the first available profile as fallback
              profile = mockProfiles[0];
              if (!profile) {
                throw new Error(`No profiles available in mock data`);
              }
            }

            // Update cache with fetched profile
            set(
              (state) => ({
                cache: {
                  ...state.cache,
                  profiles: new Map(state.cache.profiles).set(key, profile),
                  loading: new Map(state.cache.loading).set(key, false),
                  lastFetch: new Map(state.cache.lastFetch).set(
                    key,
                    Date.now(),
                  ),
                },
              }),
              false,
              'profile/fetchProfile/success',
            );

            console.log('Profile fetched successfully:', key);
            return profile;
          } catch (err: any) {
            const errorMessage = err.message || 'Failed to fetch profile';

            // Update cache with error
            set(
              (state) => ({
                cache: {
                  ...state.cache,
                  loading: new Map(state.cache.loading).set(key, false),
                  errors: new Map(state.cache.errors).set(key, errorMessage),
                },
              }),
              false,
              'profile/fetchProfile/error',
            );

            setError(errorMessage);
            console.error('❌ Failed to fetch profile:', err);
            return null;
          } finally {
            setLoading(false);
          }
        },

        preloadProfile: async (query: ProfileQuery) => {
          const key = createCacheKey(query);
          console.log('🔄 Preloading profile:', key);

          // Check if already cached or loading
          const cachedProfile = get().getProfile(query);
          if (cachedProfile) {
            console.log('Profile already cached, skipping preload:', key);
            return;
          }

          if (get().cache.loading.get(key)) {
            console.log('Profile already loading, skipping preload:', key);
            return;
          }

          // Preload without affecting global loading state
          try {
            await get().fetchProfile(query);
            console.log('Profile preloaded:', key);
          } catch (err) {
            console.error('❌ Failed to preload profile:', err);
          }
        },

        invalidateProfile: (query: ProfileQuery) => {
          const key = createCacheKey(query);

          set(
            (state) => {
              const newProfiles = new Map(state.cache.profiles);
              const newLastFetch = new Map(state.cache.lastFetch);
              const newErrors = new Map(state.cache.errors);

              newProfiles.delete(key);
              newLastFetch.delete(key);
              newErrors.delete(key);

              return {
                cache: {
                  ...state.cache,
                  profiles: newProfiles,
                  lastFetch: newLastFetch,
                  errors: newErrors,
                },
              };
            },
            false,
            'profile/invalidateProfile',
          );

          console.log('🗑️ Profile invalidated:', key);
        },

        refreshProfile: async (query: ProfileQuery) => {
          const { invalidateProfile, fetchProfile } = get();
          console.log('🔄 Refreshing profile:', createCacheKey(query));

          invalidateProfile(query);
          return await fetchProfile(query);
        },

        clearCache: () => {
          set(
            () => ({
              cache: {
                profiles: new Map(),
                loading: new Map(),
                errors: new Map(),
                lastFetch: new Map(),
              },
              currentProfileId: null,
              error: null,
            }),
            false,
            'profile/clearCache',
          );

          console.log('🗑️ Profile cache cleared');
        },
      }),
      {
        name: 'ProfileStore',
        // Only persist current profile ID, not the entire cache
        partialize: (state) => ({
          currentProfileId: state.currentProfileId,
        }),
      },
    ),
    { name: 'ProfileStore' },
  ),
);

// Selector hooks for better performance
export const useCurrentProfileId = () =>
  useProfileStore((state) => state.currentProfileId);
export const useProfileLoading = () =>
  useProfileStore((state) => state.isLoading);
export const useProfileError = () => useProfileStore((state) => state.error);

// Get current profile
export const useCurrentProfile = () =>
  useProfileStore((state) => {
    if (!state.currentProfileId) return null;
    return state.cache.profiles.get(state.currentProfileId) || null;
  });

// Get specific profile from cache
export const useCachedProfile = (query: ProfileQuery) =>
  useProfileStore((state) => {
    const key = createCacheKey(query);
    return state.cache.profiles.get(key) || null;
  });

// Check if profile is loading
export const useProfileLoadingState = (query: ProfileQuery) =>
  useProfileStore((state) => {
    const key = createCacheKey(query);
    return state.cache.loading.get(key) || false;
  });

// Get profile error
export const useProfileErrorState = (query: ProfileQuery) =>
  useProfileStore((state) => {
    const key = createCacheKey(query);
    return state.cache.errors.get(key) || null;
  });

// Action hooks - individual hooks prevent infinite loops
export const useSetCurrentProfile = () =>
  useProfileStore((state) => state.setCurrentProfile);
export const useFetchProfile = () =>
  useProfileStore((state) => state.fetchProfile);
export const usePreloadProfile = () =>
  useProfileStore((state) => state.preloadProfile);
export const useGetProfile = () => useProfileStore((state) => state.getProfile);
export const useInvalidateProfile = () =>
  useProfileStore((state) => state.invalidateProfile);
export const useRefreshProfile = () =>
  useProfileStore((state) => state.refreshProfile);
export const useClearProfileCache = () =>
  useProfileStore((state) => state.clearCache);
export const useSetProfileError = () =>
  useProfileStore((state) => state.setError);

// Deprecated: Use individual action hooks above to prevent infinite loops
export const useProfileActions = () => ({
  setCurrentProfile: useProfileStore.getState().setCurrentProfile,
  fetchProfile: useProfileStore.getState().fetchProfile,
  preloadProfile: useProfileStore.getState().preloadProfile,
  getProfile: useProfileStore.getState().getProfile,
  invalidateProfile: useProfileStore.getState().invalidateProfile,
  refreshProfile: useProfileStore.getState().refreshProfile,
  clearCache: useProfileStore.getState().clearCache,
  setError: useProfileStore.getState().setError,
});

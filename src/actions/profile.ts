'use server';

import { format } from 'date-fns';
import { updateProfile } from '@/lib/api/profile';

interface ProfileFormValues {
    fullName: string;
    birthDate?: Date;
    gender?: 'male' | 'female' | 'other';
    companyName: string;
    activitySector: string;
    position: string;
}

export async function updatePreferencesAction(profileId: string, themeColor: string) {
    try {
        // Format data for API
        const data = {
            theme: { color: themeColor },
        };

        await updateProfile(profileId, data);

        return { success: true };
    } catch (error: any) {
        console.error('Server updatePreferencesAction error:', error);
        return {
            success: false,
            message: error?.message || 'Failed to update preferences',
        };
    }
}

export async function updateProfileAction(profileId: string, data: ProfileFormValues) {
    try {
        const formattedData = {
            ...data,
            birthDate: data.birthDate ? format(data.birthDate, 'yyyy-MM-dd') : undefined,
        };

        await updateProfile(profileId, formattedData);

        return { success: true };
    } catch (error) {
        console.error('[Server Action] Failed to update profile:', error);
        return { success: false, message: 'Failed to update profile' };
    }
}

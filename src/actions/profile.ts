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

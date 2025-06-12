'use server';

import { format } from 'date-fns';
import { updateProfile, createProfile, getAllProfiles, deleteProfile } from '@/lib/api/profile';
import { requestEmailChange, verifyEmailChangeOTP } from '@/lib/api/change-email';
import { LinkType, ProfileData, profileInput } from '@/types/profile';
import { User } from '@/types/user';
import { updateUser } from '@/lib/api/user';

interface ProfileFormValues {
    fullName?: string;
    birthDate?: Date;
    gender?: 'male' | 'female' | 'other';
    companyName?: string;
    activitySector?: string;
    position?: string;
    links?: LinkType[];
}

export const getAllProfilesAction = async (userId: string | null): Promise<ProfileData[]> => {
    try {
        const profiles = await getAllProfiles(userId);
        return profiles;
    } catch (error) {
        console.error('Error fetching profiles:', error);
        throw error;
    }
};

export async function createProfileAction(userId: string, data: profileInput) {
    try {
        // const formattedData = {
        //     ...data,
        //     birthDate: format(data.birthDate, 'yyyy-MM-dd'),
        // };

        const response = await createProfile(userId, data);
        console.log(JSON.stringify)
        return { success: true, data: response };
    } catch (error) {
        console.error('[Server Action] Failed to create profile:', error);
        return { success: false, message: 'Failed to create profile' };
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

export async function deleteProfileAction(profileId: string) {
    try {
        await deleteProfile(profileId);
        return { success: true };
    } catch (error) {
        console.error('[Server Action] Failed to delete profile:', error);
        return { success: false, message: 'Failed to delete profile' };
    }
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


export async function requestEmailChangeAction(userId: string, oldEmail: string, newEmail: string) {
    try {
        const response = await requestEmailChange(userId, oldEmail, newEmail);
        return { success: true, data: response };
    } catch (error) {
        console.error('Error in requestEmailChangeAction:', error);
        return { success: false, error: 'Failed to request email change.' };
    }
}

export async function verifyEmailChangeOTPAction(userId: string, sessionId: string, otp: string) {
    try {
        const response = await verifyEmailChangeOTP(userId, sessionId, otp);
        return { success: true, data: response };
    } catch (error) {
        console.error('Error in verifyEmailChangeOTPAction:', error);
        return { success: false, error: 'Failed to verify OTP.' };
    }
}

export async function switchProfile(userId: string, profileId: string) {
    try {
        const response = await updateUser(userId, { selectedProfile: profileId } as User);
        return { success: true, data: response };
    } catch (error) {
        console.error('Error in switchProfile:', error);
        return { success: false, error: 'Failed to switch profile.' };
    }
}
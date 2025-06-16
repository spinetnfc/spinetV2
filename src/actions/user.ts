"use server";
import { updateUser } from "@/lib/api/user";
import { User } from "@/types/user";

export async function updateUserAction(userId: string, user: Partial<User>) {
    try {
        await updateUser(userId, user);
        return { success: true };
    } catch (error) {
        console.error('[Server Action] Failed to update profile:', error);
        return { success: false, message: 'Failed to update profile' };
    }
}
'use server';

import { addLinks } from '@/lib/api/links'; // your existing API helper
import type { LinkType } from '@/types/profile';

export async function addLinksAction(profileId: string, links: LinkType[]) {
    try {
        const response = await addLinks(profileId, links);
        return { success: true, data: response };
    } catch (error: unknown) {
        console.error('Error in addLinksAction:', error);
        return {
            success: false,
            message: error instanceof Error ? error.message : 'Failed to add links.',
        };
    }
}

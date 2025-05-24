import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import type { User } from '@/types/user';
import { apiFetch } from '@/utils/api';

export async function getServerSession() {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get('spinet-session')?.value;
    const userCookie = cookieStore.get('current-user')?.value;
    const fileApiToken = cookieStore.get('fileApiToken')?.value;

    if (!sessionId || !userCookie || !fileApiToken) {
      return null;
    }

    const user: User = JSON.parse(decodeURIComponent(userCookie));
    return { user, fileApiToken };
  } catch (error) {
    console.error('Error getting server session:', error);
    return null;
  }
}

export async function requireAuth() {
  const session = await getServerSession();
  
  if (!session) {
    const locale = getLocaleFromCookies();
    redirect(`/${locale}/auth/login`);
  }
  
  return session;
}

export async function validateServerSession() {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get('spinet-session')?.value;
    const fileApiToken = cookieStore.get('fileApiToken')?.value;

    if (!sessionId || !fileApiToken) {
      return false;
    }

    // Make a lightweight request to validate the session
    await apiFetch('/auth/validate', {
      headers: {
        Authorization: `Bearer ${fileApiToken}`
      }
    });
    return true;
  } catch (error) {
    console.error('Session validation error:', error);
    return false;
  }
}

export async function getServerUser(): Promise<User | null> {
  const session = await getServerSession();
  return session?.user || null;
}

export async function getLocaleFromCookies(): Promise<string> {
  const cookieStore = await cookies();
  return cookieStore.get('NEXT_LOCALE')?.value || 'en';
} 
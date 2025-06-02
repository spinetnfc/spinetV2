import type { User } from '@/types/user';
import { cookies } from 'next/headers';

export async function getUserCookieOnServer(): Promise<User | null> {
  const cookieStore = await cookies();
  const userCookie = cookieStore.get('current-user')?.value;
  const sessionId = cookieStore.get('spinet-session')?.value;

  if (!sessionId || !userCookie) {
    return null;
  }

  try {
    const user: User = JSON.parse(decodeURIComponent(userCookie));
    return user;
  } catch (error) {
    console.error('Error parsing user cookie:', error);
    return null;
  }
}



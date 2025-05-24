import type { User } from '@/types/user';
import { cookies } from 'next/headers';  // for server-side cookie handling

export async function getUserCookieOnServer(): Promise<User | null> {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get('spinet-session')?.value;
  const userCookie = cookieStore.get('current-user')?.value;

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



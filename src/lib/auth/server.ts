import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import type { User } from '@/types/user';

export async function getServerSession() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get('spinet-session')?.value;
  const userCookie = cookieStore.get('current-user')?.value;

  if (!sessionId || !userCookie) {
    return null;
  }

  try {
    const user: User = JSON.parse(decodeURIComponent(userCookie));
    return { user };
  } catch (error) {
    console.error('Error parsing user cookie:', error);
    return null;
  }
}

export async function requireAuth() {
  const session = await getServerSession();
  
  if (!session) {
    const cookieStore = await cookies();
    const locale = cookieStore.get('NEXT_LOCALE')?.value || 'en';
    redirect(`/${locale}/auth/login`);
  }
  
  return session;
} 
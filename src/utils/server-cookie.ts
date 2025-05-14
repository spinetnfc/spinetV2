import { User } from '@/context/authContext';
import { cookies } from 'next/headers';  // for server-side cookie handling

export async function getUserCookieOnServer(): Promise<User | null> {
  const cookieStore = await cookies();
  const userCookie = cookieStore.get('current-user')?.value;

  if (userCookie) {
    const userFromCookie = JSON.parse(decodeURIComponent(userCookie));
    return userFromCookie;
  } else {
    console.error('No user cookie found');
    return null;
  }
}



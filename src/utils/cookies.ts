import { cookies } from 'next/headers';  // for server-side cookie handling

export function getUserFromCookie() {
    const cookieString = document.cookie
      .split('; ')
      .find(row => row.startsWith('current-user='));
    if (!cookieString) return null;
  
    try {
      const json = decodeURIComponent(cookieString.split('=')[1]);
      return JSON.parse(json);
    } catch (err) {
      console.error('Failed to parse user cookie:', err);
      return null;
    }
  }


  export async function getUserCookieOnServer(): Promise<string | null> {
    const cookieStore = await cookies();
    const userCookie = cookieStore.get('current-user')?.value;
  
    if (userCookie) {
      const userFromCookie = JSON.parse(decodeURIComponent(userCookie));
      console.log('User from cookie:', userFromCookie);
      return userFromCookie._id; // Assuming `id` is the user identifier in the cookie
    } else {
      console.log('User cookie not found');
      return null;
    }
  }
  

  
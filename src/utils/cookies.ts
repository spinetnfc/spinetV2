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


  export async function getUserCookieOnServer(): Promise<any> {
    const cookieStore = await cookies();
    const userCookie = cookieStore.get('current-user')?.value;
  
    if (userCookie) {
      const userFromCookie = JSON.parse(decodeURIComponent(userCookie));
      return userFromCookie;
    } else {
      return null;
    }
  }
  

  
import { cookies } from 'next/headers';
import { ServerApi } from './axios'; // or wherever your axios instance is
import { AxiosRequestConfig, AxiosResponse } from 'axios';

export const serverApiWithCookies = async () => {
  const cookieStore = await cookies(); // now await because it's async
  const sessionCookie = cookieStore.get('spinet-session');
  const sessionSig = cookieStore.get('spinet-session.sig');

  if (!sessionCookie || !sessionSig) {
    throw new Error('Missing authentication cookies');
  }

  const cookieHeader = `spinet-session=${sessionCookie.value}; spinet-session.sig=${sessionSig.value}`;

  // Create an axios config with the cookie header
  const attachCookies = (config: AxiosRequestConfig = {}): AxiosRequestConfig => ({
    ...config,
    headers: {
      ...config.headers,
      Cookie: cookieHeader,
    },
  });

  return {
    get<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
      return ServerApi.get<T>(url, attachCookies(config));
    },
    post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
      return ServerApi.post<T>(url, data, attachCookies(config));
    },
    patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
      return ServerApi.patch<T>(url, data, attachCookies(config));
    },
    delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
      return ServerApi.delete<T>(url, attachCookies(config));
    },
  };
};

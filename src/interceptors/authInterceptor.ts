import { ErrorMessages } from '@/types/messages';
import { InternalAxiosRequestConfig } from 'axios';
import { deleteCookie, getCookie } from 'cookies-next';

export const authInterceptor = async (config: InternalAxiosRequestConfig) => {
  const needsToAuth = config.headers?.authHeader !== undefined;

  if (needsToAuth) {
    try {
      const token = getCookie('helloWorld');

      if (!token) throw new Error(ErrorMessages.MSGE14);

      const newConfig: any = {
        ...config,
        headers: { ...config.headers, Authorization: `Bearer ${token}` },
      };

      delete newConfig.headers['authHeader'];

      return newConfig;
    } catch {
      deleteCookie('helloWorld');
    }
  }

  return config;
};

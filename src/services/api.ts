import axios from 'axios';
import { paths } from '@/routes/paths';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:8080',
  withCredentials: true,
});

const AUTH_SKIP_REDIRECT = ['/api/auth/login', '/api/auth/register', '/api/auth/me'];

api.interceptors.response.use(
  response => response,
  error => {
    const url = error.config?.url ?? '';
    const isAuthRoute = AUTH_SKIP_REDIRECT.some(path => url.includes(path));
    const isPublicPage =
      window.location.pathname === paths.login ||
      window.location.pathname === paths.register;

    if (error.response?.status === 401 && !isAuthRoute && !isPublicPage) {
      const redirect = `${paths.login}?session=expired`;
      if (window.location.pathname + window.location.search !== redirect) {
        window.location.href = redirect;
      }
    }

    return Promise.reject(error);
  },
);

import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { authApi } from '@/features/auth/authApi';
import { tokenStorage } from '@/features/auth/tokenStorage';

export const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 15_000,
});

httpClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const accessToken = tokenStorage.getAccessToken();
  if (accessToken) {
    config.headers.set('Authorization', `Bearer ${accessToken}`);
  }
  return config;
});

/**
 * Un seul rafraîchissement à la fois : si plusieurs requêtes échouent
 * simultanément en 401 (cas courant au chargement d'une page qui appelle
 * plusieurs endpoints), elles attendent toutes le même refresh au lieu d'en
 * déclencher un chacune.
 */
let refreshPromise: Promise<string> | null = null;

function refreshAccessToken(): Promise<string> {
  if (!refreshPromise) {
    const refreshToken = tokenStorage.getRefreshToken();
    if (!refreshToken) {
      return Promise.reject(new Error('Aucun refresh token disponible'));
    }

    refreshPromise = authApi
      .refresh(refreshToken)
      .then((response) => {
        tokenStorage.setAccessToken(response.accessToken);
        return response.accessToken;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

function redirectToLogin(): void {
  tokenStorage.clear();
  if (window.location.pathname !== '/login') {
    window.location.assign('/login');
  }
}

httpClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retried?: boolean };

    if (error.response?.status !== 401 || !originalRequest || originalRequest._retried) {
      return Promise.reject(error);
    }

    originalRequest._retried = true;

    try {
      const accessToken = await refreshAccessToken();
      originalRequest.headers.set('Authorization', `Bearer ${accessToken}`);
      return httpClient(originalRequest);
    } catch {
      redirectToLogin();
      return Promise.reject(error);
    }
  },
);

import axios, { type InternalAxiosRequestConfig } from 'axios';
import { keycloak } from '@/features/auth/keycloak';

export const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 15_000,
});

httpClient.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  if (keycloak.token) {
    await keycloak.updateToken(30).catch(() => keycloak.login());
    config.headers.set('Authorization', `Bearer ${keycloak.token}`);
  }
  return config;
});

httpClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await keycloak.login();
    }
    return Promise.reject(error);
  },
);

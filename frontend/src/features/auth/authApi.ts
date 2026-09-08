import axios from 'axios';
import type { AuthResponse, LoginCredentials, UserBackendResponse } from './types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const authApi = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await axios.post<AuthResponse>(`${API_BASE_URL}/api/v1/auth/login`, credentials);
    if (response.data.accessToken) {
      localStorage.setItem('access_token', response.data.accessToken);
      localStorage.setItem('refresh_token', response.data.refreshToken);
    }
    return response.data;
  },

  async refreshToken(): Promise<AuthResponse> {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }
    const response = await axios.post<AuthResponse>(`${API_BASE_URL}/api/v1/auth/refresh`, { refreshToken });
    if (response.data.accessToken) {
      localStorage.setItem('access_token', response.data.accessToken);
      localStorage.setItem('refresh_token', response.data.refreshToken);
    }
    return response.data;
  },

  async logout(): Promise<void> {
    const accessToken = localStorage.getItem('access_token');
    try {
      if (accessToken) {
        await axios.post(
          `${API_BASE_URL}/api/v1/auth/logout`,
          {},
          { headers: { Authorization: `Bearer ${accessToken}` } },
        );
      }
    } catch {
      // Ignorer l'erreur réseau éventuelle lors du logout
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    }
  },

  async getMe(): Promise<UserBackendResponse> {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      throw new Error('No access token available');
    }
    const response = await axios.get<UserBackendResponse>(`${API_BASE_URL}/api/v1/auth/me`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return response.data;
  },
};

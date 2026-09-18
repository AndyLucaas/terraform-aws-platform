import axios from 'axios';
import type {
  ChangePasswordPayload,
  LoginCredentials,
  LoginResponse,
  RefreshTokenResponse,
} from './types';

/**
 * Client dédié à l'authentification, volontairement séparé de httpClient :
 * il ne porte aucun intercepteur, pour éviter qu'un refresh en échec ne
 * déclenche une boucle de rafraîchissement récursive.
 */
const authClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 15_000,
});

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const { data } = await authClient.post<LoginResponse>('/api/v1/auth/login', credentials);
    return data;
  },

  refresh: async (refreshToken: string): Promise<RefreshTokenResponse> => {
    const { data } = await authClient.post<RefreshTokenResponse>('/api/v1/auth/refresh', { refreshToken });
    return data;
  },

  changePassword: async (payload: ChangePasswordPayload, accessToken: string): Promise<void> => {
    await authClient.post('/api/v1/auth/change-password', payload, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  },
};

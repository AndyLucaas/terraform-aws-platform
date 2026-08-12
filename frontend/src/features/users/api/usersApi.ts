import { httpClient } from '@/shared/api/httpClient';
import type { PageResponse } from '@/shared/types/pagination';
import type { UserAccount, UserFormPayload } from '../types';

export const usersApi = {
  search: async (query: string, page: number): Promise<PageResponse<UserAccount>> => {
    const { data } = await httpClient.get<PageResponse<UserAccount>>('/api/v1/users', {
      params: { query, page, size: 20 },
    });
    return data;
  },

  create: async (payload: UserFormPayload & { username: string }): Promise<UserAccount> => {
    const { data } = await httpClient.post<UserAccount>('/api/v1/users', payload);
    return data;
  },

  update: async (id: number, payload: UserFormPayload): Promise<UserAccount> => {
    const { data } = await httpClient.put<UserAccount>(`/api/v1/users/${id}`, payload);
    return data;
  },

  block: async (id: number): Promise<void> => {
    await httpClient.post(`/api/v1/users/${id}/block`);
  },

  unblock: async (id: number): Promise<void> => {
    await httpClient.post(`/api/v1/users/${id}/unblock`);
  },

  resetPassword: async (id: number): Promise<void> => {
    await httpClient.post(`/api/v1/users/${id}/reset-password`);
  },

  remove: async (id: number): Promise<void> => {
    await httpClient.delete(`/api/v1/users/${id}`);
  },
};

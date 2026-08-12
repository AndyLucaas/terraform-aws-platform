import { httpClient } from '@/shared/api/httpClient';
import type { UserAccount } from '@/features/users/types';

export interface ProfileUpdatePayload {
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  jobTitle?: string;
  avatarUrl?: string;
  locale?: string;
}

export const profileApi = {
  get: async (): Promise<UserAccount> => {
    const { data } = await httpClient.get<UserAccount>('/api/v1/profile');
    return data;
  },

  update: async (payload: ProfileUpdatePayload): Promise<UserAccount> => {
    const { data } = await httpClient.put<UserAccount>('/api/v1/profile', payload);
    return data;
  },
};

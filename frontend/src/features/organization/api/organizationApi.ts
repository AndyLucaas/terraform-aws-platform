import { httpClient } from '@/shared/api/httpClient';
import type { Department, Team } from '../types';

export const organizationApi = {
  departments: async (): Promise<Department[]> => {
    const { data } = await httpClient.get<Department[]>('/api/v1/departments');
    return data;
  },

  teams: async (departmentId?: number): Promise<Team[]> => {
    const { data } = await httpClient.get<Team[]>('/api/v1/teams', { params: { departmentId } });
    return data;
  },
};

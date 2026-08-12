import { httpClient } from '@/shared/api/httpClient';
import type { Department, Team } from '../types';

export const organizationMutationsApi = {
  createDepartment: async (name: string, description?: string): Promise<Department> => {
    const { data } = await httpClient.post<Department>('/api/v1/departments', { name, description });
    return data;
  },

  deleteDepartment: async (id: number): Promise<void> => {
    await httpClient.delete(`/api/v1/departments/${id}`);
  },

  createTeam: async (name: string, departmentId: number, description?: string): Promise<Team> => {
    const { data } = await httpClient.post<Team>('/api/v1/teams', { name, departmentId, description });
    return data;
  },

  deleteTeam: async (id: number): Promise<void> => {
    await httpClient.delete(`/api/v1/teams/${id}`);
  },
};

import { httpClient } from '@/shared/api/httpClient';
import type { TicketSummary } from '@/features/tickets/types';
import type { DashboardCharts, DashboardStats } from '../types';

export const dashboardApi = {
  stats: async (): Promise<DashboardStats> => {
    const { data } = await httpClient.get<DashboardStats>('/api/v1/dashboard/stats');
    return data;
  },

  charts: async (): Promise<DashboardCharts> => {
    const { data } = await httpClient.get<DashboardCharts>('/api/v1/dashboard/charts');
    return data;
  },

  recentTickets: async (limit = 8): Promise<TicketSummary[]> => {
    const { data } = await httpClient.get<TicketSummary[]>('/api/v1/dashboard/recent-tickets', { params: { limit } });
    return data;
  },
};

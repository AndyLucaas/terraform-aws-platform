import { httpClient } from '@/shared/api/httpClient';
import type { Category, Tag, TicketPriority, TicketStatus } from '../types';

export const referenceDataApi = {
  statuses: async (): Promise<TicketStatus[]> => {
    const { data } = await httpClient.get<TicketStatus[]>('/api/v1/reference-data/statuses');
    return data;
  },

  priorities: async (): Promise<TicketPriority[]> => {
    const { data } = await httpClient.get<TicketPriority[]>('/api/v1/reference-data/priorities');
    return data;
  },

  categories: async (): Promise<Category[]> => {
    const { data } = await httpClient.get<Category[]>('/api/v1/categories');
    return data;
  },

  tags: async (query?: string): Promise<Tag[]> => {
    const { data } = await httpClient.get<Tag[]>('/api/v1/tags', { params: { query } });
    return data;
  },
};

import { httpClient } from '@/shared/api/httpClient';
import type { PageResponse } from '@/shared/types/pagination';
import type {
  TicketCreatePayload,
  TicketDetail,
  TicketFilters,
  TicketSummary,
  TicketUpdatePayload,
} from '../types';

export const ticketsApi = {
  search: async (filters: TicketFilters, page: number, size = 20): Promise<PageResponse<TicketSummary>> => {
    const { data } = await httpClient.get<PageResponse<TicketSummary>>('/api/v1/tickets', {
      params: { ...filters, page, size, sort: 'createdAt,desc' },
    });
    return data;
  },

  findById: async (id: number): Promise<TicketDetail> => {
    const { data } = await httpClient.get<TicketDetail>(`/api/v1/tickets/${id}`);
    return data;
  },

  create: async (payload: TicketCreatePayload): Promise<TicketDetail> => {
    const { data } = await httpClient.post<TicketDetail>('/api/v1/tickets', payload);
    return data;
  },

  update: async (id: number, payload: TicketUpdatePayload): Promise<TicketDetail> => {
    const { data } = await httpClient.put<TicketDetail>(`/api/v1/tickets/${id}`, payload);
    return data;
  },

  remove: async (id: number): Promise<void> => {
    await httpClient.delete(`/api/v1/tickets/${id}`);
  },
};

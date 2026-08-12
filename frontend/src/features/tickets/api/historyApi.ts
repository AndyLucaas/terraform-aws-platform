import { httpClient } from '@/shared/api/httpClient';
import type { PageResponse } from '@/shared/types/pagination';
import type { TicketHistoryEntry } from '../types';

export const historyApi = {
  list: async (ticketId: number): Promise<PageResponse<TicketHistoryEntry>> => {
    const { data } = await httpClient.get<PageResponse<TicketHistoryEntry>>(`/api/v1/tickets/${ticketId}/history`, {
      params: { page: 0, size: 100 },
    });
    return data;
  },
};

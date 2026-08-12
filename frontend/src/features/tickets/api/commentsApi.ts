import { httpClient } from '@/shared/api/httpClient';
import type { PageResponse } from '@/shared/types/pagination';
import type { Comment } from '../types';

export const commentsApi = {
  list: async (ticketId: number, page: number): Promise<PageResponse<Comment>> => {
    const { data } = await httpClient.get<PageResponse<Comment>>(`/api/v1/tickets/${ticketId}/comments`, {
      params: { page, size: 50 },
    });
    return data;
  },

  create: async (ticketId: number, content: string, internal: boolean): Promise<Comment> => {
    const { data } = await httpClient.post<Comment>(`/api/v1/tickets/${ticketId}/comments`, { content, internal });
    return data;
  },
};

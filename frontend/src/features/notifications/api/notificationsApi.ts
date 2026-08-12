import { httpClient } from '@/shared/api/httpClient';
import type { PageResponse } from '@/shared/types/pagination';
import type { NotificationDto } from '../types';

export const notificationsApi = {
  list: async (page: number): Promise<PageResponse<NotificationDto>> => {
    const { data } = await httpClient.get<PageResponse<NotificationDto>>('/api/v1/notifications', {
      params: { page, size: 15 },
    });
    return data;
  },

  unreadCount: async (): Promise<number> => {
    const { data } = await httpClient.get<number>('/api/v1/notifications/unread-count');
    return data;
  },

  markAsRead: async (id: number): Promise<void> => {
    await httpClient.post(`/api/v1/notifications/${id}/read`);
  },

  markAllAsRead: async (): Promise<void> => {
    await httpClient.post('/api/v1/notifications/read-all');
  },
};

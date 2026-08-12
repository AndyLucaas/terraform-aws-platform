import { httpClient } from '@/shared/api/httpClient';
import type { Attachment } from '../types';

export const attachmentsApi = {
  list: async (ticketId: number): Promise<Attachment[]> => {
    const { data } = await httpClient.get<Attachment[]>(`/api/v1/tickets/${ticketId}/attachments`);
    return data;
  },

  upload: async (ticketId: number, file: File): Promise<Attachment> => {
    const formData = new FormData();
    formData.append('file', file);
    const { data } = await httpClient.post<Attachment>(`/api/v1/tickets/${ticketId}/attachments`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  remove: async (attachmentId: number): Promise<void> => {
    await httpClient.delete(`/api/v1/attachments/${attachmentId}`);
  },

  downloadUrl: (attachmentId: number): string =>
    `${import.meta.env.VITE_API_BASE_URL}/api/v1/attachments/${attachmentId}/download`,
};

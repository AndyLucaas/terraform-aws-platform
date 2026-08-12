import { httpClient } from '@/shared/api/httpClient';
import type { Category, Tag } from '@/features/tickets/types';

export const catalogApi = {
  categories: async (): Promise<Category[]> => {
    const { data } = await httpClient.get<Category[]>('/api/v1/categories');
    return data;
  },

  createCategory: async (name: string, parentId?: number): Promise<Category> => {
    const { data } = await httpClient.post<Category>('/api/v1/categories', null, { params: { name, parentId } });
    return data;
  },

  deleteCategory: async (id: number): Promise<void> => {
    await httpClient.delete(`/api/v1/categories/${id}`);
  },

  tags: async (): Promise<Tag[]> => {
    const { data } = await httpClient.get<Tag[]>('/api/v1/tags');
    return data;
  },

  createTag: async (name: string, colorHex?: string): Promise<Tag> => {
    const { data } = await httpClient.post<Tag>('/api/v1/tags', null, { params: { name, colorHex } });
    return data;
  },

  deleteTag: async (id: number): Promise<void> => {
    await httpClient.delete(`/api/v1/tags/${id}`);
  },
};

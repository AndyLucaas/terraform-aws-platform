import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { catalogApi } from './api/catalogApi';

export function useCatalogCategories() {
  return useQuery({ queryKey: ['catalog', 'categories'], queryFn: catalogApi.categories });
}

export function useCatalogTags() {
  return useQuery({ queryKey: ['catalog', 'tags'], queryFn: catalogApi.tags });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ name, parentId }: { name: string; parentId?: number }) => catalogApi.createCategory(name, parentId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['catalog', 'categories'] }),
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: catalogApi.deleteCategory,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['catalog', 'categories'] }),
  });
}

export function useCreateTag() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ name, colorHex }: { name: string; colorHex?: string }) => catalogApi.createTag(name, colorHex),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['catalog', 'tags'] }),
  });
}

export function useDeleteTag() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: catalogApi.deleteTag,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['catalog', 'tags'] }),
  });
}

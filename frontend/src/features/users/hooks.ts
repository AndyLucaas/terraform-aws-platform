import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { usersApi } from './api/usersApi';
import type { UserFormPayload } from './types';

export function useUsers(query: string, page: number) {
  return useQuery({
    queryKey: ['users', query, page],
    queryFn: () => usersApi.search(query, page),
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UserFormPayload & { username: string }) => usersApi.create(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  });
}

export function useUpdateUser(id: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UserFormPayload) => usersApi.update(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  });
}

export function useBlockUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: usersApi.block,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  });
}

export function useUnblockUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: usersApi.unblock,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  });
}

export function useResetUserPassword() {
  return useMutation({ mutationFn: usersApi.resetPassword });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: usersApi.remove,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  });
}

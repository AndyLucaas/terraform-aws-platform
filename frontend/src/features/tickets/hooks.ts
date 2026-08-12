import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ticketsApi } from './api/ticketsApi';
import { referenceDataApi } from './api/referenceDataApi';
import { commentsApi } from './api/commentsApi';
import { attachmentsApi } from './api/attachmentsApi';
import { historyApi } from './api/historyApi';
import type { TicketCreatePayload, TicketFilters, TicketUpdatePayload } from './types';

export function useTickets(filters: TicketFilters, page: number) {
  return useQuery({
    queryKey: ['tickets', filters, page],
    queryFn: () => ticketsApi.search(filters, page),
  });
}

export function useTicket(id: number) {
  return useQuery({
    queryKey: ['tickets', id],
    queryFn: () => ticketsApi.findById(id),
    enabled: Boolean(id),
  });
}

export function useCreateTicket() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: TicketCreatePayload) => ticketsApi.create(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tickets'] }),
  });
}

export function useUpdateTicket(id: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: TicketUpdatePayload) => ticketsApi.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      queryClient.invalidateQueries({ queryKey: ['tickets', id] });
    },
  });
}

export function useDeleteTicket() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => ticketsApi.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tickets'] }),
  });
}

export function useTicketStatuses() {
  return useQuery({ queryKey: ['reference-data', 'statuses'], queryFn: referenceDataApi.statuses, staleTime: Infinity });
}

export function useTicketPriorities() {
  return useQuery({ queryKey: ['reference-data', 'priorities'], queryFn: referenceDataApi.priorities, staleTime: Infinity });
}

export function useCategories() {
  return useQuery({ queryKey: ['reference-data', 'categories'], queryFn: referenceDataApi.categories });
}

export function useTags(query?: string) {
  return useQuery({ queryKey: ['reference-data', 'tags', query], queryFn: () => referenceDataApi.tags(query) });
}

export function useComments(ticketId: number) {
  return useQuery({
    queryKey: ['tickets', ticketId, 'comments'],
    queryFn: () => commentsApi.list(ticketId, 0),
    enabled: Boolean(ticketId),
  });
}

export function useAddComment(ticketId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ content, internal }: { content: string; internal: boolean }) =>
      commentsApi.create(ticketId, content, internal),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tickets', ticketId, 'comments'] }),
  });
}

export function useAttachments(ticketId: number) {
  return useQuery({
    queryKey: ['tickets', ticketId, 'attachments'],
    queryFn: () => attachmentsApi.list(ticketId),
    enabled: Boolean(ticketId),
  });
}

export function useUploadAttachment(ticketId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => attachmentsApi.upload(ticketId, file),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tickets', ticketId, 'attachments'] }),
  });
}

export function useTicketHistory(ticketId: number) {
  return useQuery({
    queryKey: ['tickets', ticketId, 'history'],
    queryFn: () => historyApi.list(ticketId),
    enabled: Boolean(ticketId),
  });
}

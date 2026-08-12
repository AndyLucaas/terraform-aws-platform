import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { profileApi, type ProfileUpdatePayload } from './api/profileApi';

export function useProfile() {
  return useQuery({ queryKey: ['profile'], queryFn: profileApi.get });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ProfileUpdatePayload) => profileApi.update(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['profile'] }),
  });
}

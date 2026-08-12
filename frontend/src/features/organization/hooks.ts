import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { organizationApi } from './api/organizationApi';
import { organizationMutationsApi } from './api/organizationMutationsApi';

export function useDepartments() {
  return useQuery({ queryKey: ['organization', 'departments'], queryFn: organizationApi.departments });
}

export function useTeams(departmentId?: number) {
  return useQuery({
    queryKey: ['organization', 'teams', departmentId],
    queryFn: () => organizationApi.teams(departmentId),
  });
}

export function useCreateDepartment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ name, description }: { name: string; description?: string }) =>
      organizationMutationsApi.createDepartment(name, description),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['organization', 'departments'] }),
  });
}

export function useDeleteDepartment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: organizationMutationsApi.deleteDepartment,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['organization', 'departments'] }),
  });
}

export function useCreateTeam() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ name, departmentId, description }: { name: string; departmentId: number; description?: string }) =>
      organizationMutationsApi.createTeam(name, departmentId, description),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['organization', 'teams'] }),
  });
}

export function useDeleteTeam() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: organizationMutationsApi.deleteTeam,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['organization', 'teams'] }),
  });
}

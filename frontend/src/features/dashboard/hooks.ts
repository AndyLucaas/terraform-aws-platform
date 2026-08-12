import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from './api/dashboardApi';

export function useDashboardStats() {
  return useQuery({ queryKey: ['dashboard', 'stats'], queryFn: dashboardApi.stats, refetchInterval: 60_000 });
}

export function useDashboardCharts() {
  return useQuery({ queryKey: ['dashboard', 'charts'], queryFn: dashboardApi.charts, refetchInterval: 60_000 });
}

export function useRecentTickets() {
  return useQuery({ queryKey: ['dashboard', 'recent-tickets'], queryFn: () => dashboardApi.recentTickets(8) });
}

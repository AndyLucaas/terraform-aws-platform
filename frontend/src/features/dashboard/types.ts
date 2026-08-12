export interface DashboardStats {
  totalTickets: number;
  openTickets: number;
  closedTickets: number;
  criticalTickets: number;
  pendingTickets: number;
  ticketsToday: number;
  ticketsThisWeek: number;
  ticketsThisMonth: number;
  availableTechnicians: number;
  averageResolutionTimeHours: number;
}

export interface ChartSeriesPoint {
  label: string;
  value: number;
}

export interface DashboardCharts {
  ticketsByStatus: ChartSeriesPoint[];
  ticketsByPriority: ChartSeriesPoint[];
  ticketsCreatedLast14Days: ChartSeriesPoint[];
}

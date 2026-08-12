package com.itdesk.platform.dto.dashboard;

public record DashboardStatsResponse(
        long totalTickets,
        long openTickets,
        long closedTickets,
        long criticalTickets,
        long pendingTickets,
        long ticketsToday,
        long ticketsThisWeek,
        long ticketsThisMonth,
        long availableTechnicians,
        double averageResolutionTimeHours
) {
}

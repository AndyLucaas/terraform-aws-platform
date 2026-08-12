package com.itdesk.platform.dto.dashboard;

import java.util.List;

public record DashboardChartsResponse(
        List<ChartSeriesPointResponse> ticketsByStatus,
        List<ChartSeriesPointResponse> ticketsByPriority,
        List<ChartSeriesPointResponse> ticketsCreatedLast14Days
) {
}

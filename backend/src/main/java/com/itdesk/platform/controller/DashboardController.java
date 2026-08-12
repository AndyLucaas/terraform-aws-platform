package com.itdesk.platform.controller;

import com.itdesk.platform.dto.dashboard.DashboardChartsResponse;
import com.itdesk.platform.dto.dashboard.DashboardStatsResponse;
import com.itdesk.platform.dto.ticket.TicketSummaryResponse;
import com.itdesk.platform.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/stats")
    public DashboardStatsResponse getStats() {
        return dashboardService.getStats();
    }

    @GetMapping("/charts")
    public DashboardChartsResponse getCharts() {
        return dashboardService.getCharts();
    }

    @GetMapping("/recent-tickets")
    public List<TicketSummaryResponse> getRecentTickets(@RequestParam(defaultValue = "10") int limit) {
        return dashboardService.getRecentTickets(limit);
    }
}

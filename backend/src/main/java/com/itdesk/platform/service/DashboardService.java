package com.itdesk.platform.service;

import com.itdesk.platform.dto.dashboard.ChartSeriesPointResponse;
import com.itdesk.platform.dto.dashboard.DashboardChartsResponse;
import com.itdesk.platform.dto.dashboard.DashboardStatsResponse;
import com.itdesk.platform.dto.ticket.TicketSummaryResponse;
import com.itdesk.platform.mapper.TicketMapper;
import com.itdesk.platform.repository.TicketPriorityRepository;
import com.itdesk.platform.repository.TicketRepository;
import com.itdesk.platform.repository.TicketStatusRepository;
import com.itdesk.platform.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.time.temporal.TemporalAdjusters;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DashboardService {

    private final TicketRepository ticketRepository;
    private final TicketStatusRepository ticketStatusRepository;
    private final TicketPriorityRepository ticketPriorityRepository;
    private final UserRepository userRepository;
    private final TicketMapper ticketMapper;

    private static final DateTimeFormatter DAY_LABEL_FORMAT = DateTimeFormatter.ofPattern("dd/MM");

    public DashboardStatsResponse getStats() {
        Instant startOfToday = LocalDate.now().atStartOfDay().toInstant(ZoneOffset.UTC);
        Instant startOfWeek = LocalDate.now().with(TemporalAdjusters.previousOrSame(java.time.DayOfWeek.MONDAY))
                .atStartOfDay().toInstant(ZoneOffset.UTC);
        Instant startOfMonth = LocalDate.now().withDayOfMonth(1).atStartOfDay().toInstant(ZoneOffset.UTC);

        Double averageResolutionHours = ticketRepository.findAverageResolutionTimeInHours();

        return new DashboardStatsResponse(
                ticketRepository.count(),
                ticketRepository.countByStatus_ClosedStateFalse(),
                ticketRepository.countByStatus_ClosedStateTrue(),
                ticketRepository.countByPriority_Code("CRITICAL"),
                ticketRepository.countByStatus_Code("PENDING"),
                ticketRepository.countByCreatedAtGreaterThanEqual(startOfToday),
                ticketRepository.countByCreatedAtGreaterThanEqual(startOfWeek),
                ticketRepository.countByCreatedAtGreaterThanEqual(startOfMonth),
                userRepository.countAvailableTechnicians(),
                averageResolutionHours != null ? Math.round(averageResolutionHours * 10.0) / 10.0 : 0.0
        );
    }

    public DashboardChartsResponse getCharts() {
        List<ChartSeriesPointResponse> byStatus = ticketStatusRepository.findAll().stream()
                .map(status -> new ChartSeriesPointResponse(status.getLabel(), ticketRepository.countByStatus_Code(status.getCode())))
                .toList();

        List<ChartSeriesPointResponse> byPriority = ticketPriorityRepository.findAll().stream()
                .map(priority -> new ChartSeriesPointResponse(priority.getLabel(), ticketRepository.countByPriority_Code(priority.getCode())))
                .toList();

        List<ChartSeriesPointResponse> last14Days = buildLast14DaysSeries();

        return new DashboardChartsResponse(byStatus, byPriority, last14Days);
    }

    public List<TicketSummaryResponse> getRecentTickets(int limit) {
        return ticketRepository.findAll(PageRequest.of(0, limit, Sort.by(Sort.Direction.DESC, "createdAt")))
                .map(ticketMapper::toSummary)
                .getContent();
    }

    private List<ChartSeriesPointResponse> buildLast14DaysSeries() {
        return java.util.stream.IntStream.rangeClosed(0, 13)
                .mapToObj(offset -> LocalDate.now().minusDays(13L - offset))
                .map(day -> {
                    Instant dayStart = day.atStartOfDay().toInstant(ZoneOffset.UTC);
                    Instant dayEnd = dayStart.plus(1, ChronoUnit.DAYS);
                    long count = ticketRepository.count((root, query, cb) -> cb.and(
                            cb.greaterThanOrEqualTo(root.get("createdAt"), dayStart),
                            cb.lessThan(root.get("createdAt"), dayEnd)
                    ));
                    return new ChartSeriesPointResponse(day.format(DAY_LABEL_FORMAT), count);
                })
                .toList();
    }
}

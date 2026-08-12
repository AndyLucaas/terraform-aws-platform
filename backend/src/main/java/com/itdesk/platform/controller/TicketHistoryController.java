package com.itdesk.platform.controller;

import com.itdesk.platform.dto.common.PageResponse;
import com.itdesk.platform.dto.ticket.TicketHistoryResponse;
import com.itdesk.platform.service.TicketHistoryQueryService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/tickets/{ticketId}/history")
@RequiredArgsConstructor
public class TicketHistoryController {

    private final TicketHistoryQueryService ticketHistoryQueryService;

    @GetMapping
    public PageResponse<TicketHistoryResponse> findByTicket(
            @PathVariable Long ticketId,
            @PageableDefault(size = 50, sort = "createdAt") Pageable pageable
    ) {
        return ticketHistoryQueryService.findByTicket(ticketId, pageable);
    }
}

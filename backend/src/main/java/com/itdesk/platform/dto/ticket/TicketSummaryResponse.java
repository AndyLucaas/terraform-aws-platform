package com.itdesk.platform.dto.ticket;

import com.itdesk.platform.dto.user.UserSummaryResponse;

import java.time.Instant;

public record TicketSummaryResponse(
        Long id,
        String reference,
        String title,
        TicketStatusResponse status,
        TicketPriorityResponse priority,
        UserSummaryResponse requester,
        UserSummaryResponse assignee,
        Instant dueDate,
        Instant createdAt
) {
}

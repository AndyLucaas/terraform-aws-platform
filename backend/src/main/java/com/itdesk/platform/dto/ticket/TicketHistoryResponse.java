package com.itdesk.platform.dto.ticket;

import com.itdesk.platform.dto.user.UserSummaryResponse;

import java.time.Instant;

public record TicketHistoryResponse(
        Long id,
        UserSummaryResponse changedBy,
        String fieldName,
        String oldValue,
        String newValue,
        Instant createdAt
) {
}

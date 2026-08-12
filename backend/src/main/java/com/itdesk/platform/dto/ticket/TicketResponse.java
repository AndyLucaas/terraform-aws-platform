package com.itdesk.platform.dto.ticket;

import com.itdesk.platform.dto.user.UserSummaryResponse;

import java.time.Instant;
import java.util.Set;

public record TicketResponse(
        Long id,
        String reference,
        String title,
        String description,
        TicketStatusResponse status,
        TicketPriorityResponse priority,
        CategoryResponse category,
        UserSummaryResponse requester,
        UserSummaryResponse assignee,
        Long teamId,
        String teamName,
        Set<TagResponse> tags,
        Instant dueDate,
        Instant resolvedAt,
        Instant closedAt,
        Instant createdAt,
        Instant updatedAt
) {
}

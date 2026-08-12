package com.itdesk.platform.dto.notification;

import java.time.Instant;

public record NotificationResponse(
        Long id,
        String type,
        String title,
        String message,
        Long ticketId,
        String ticketReference,
        boolean read,
        Instant createdAt
) {
}

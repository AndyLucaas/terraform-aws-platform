package com.itdesk.platform.dto.attachment;

import java.time.Instant;

public record AttachmentResponse(
        Long id,
        String fileName,
        String contentType,
        long sizeBytes,
        Long uploadedById,
        String uploadedByName,
        Instant createdAt
) {
}

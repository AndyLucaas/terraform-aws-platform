package com.itdesk.platform.dto.comment;

import com.itdesk.platform.dto.user.UserSummaryResponse;

import java.time.Instant;

public record CommentResponse(
        Long id,
        UserSummaryResponse author,
        String content,
        boolean internal,
        Instant createdAt,
        Instant updatedAt
) {
}

package com.itdesk.platform.dto.user;

public record UserSummaryResponse(
        Long id,
        String username,
        String fullName,
        String email,
        String avatarUrl
) {
}

package com.itdesk.platform.dto.user;

import java.time.Instant;
import java.util.Set;

public record UserResponse(
        Long id,
        String username,
        String email,
        String firstName,
        String lastName,
        String phoneNumber,
        String avatarUrl,
        String jobTitle,
        Long departmentId,
        String departmentName,
        Long teamId,
        String teamName,
        String status,
        boolean available,
        String locale,
        Set<String> roles,
        Instant lastLoginAt,
        Instant createdAt
) {
}

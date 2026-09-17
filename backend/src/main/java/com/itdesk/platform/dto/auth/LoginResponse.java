package com.itdesk.platform.dto.auth;

import com.itdesk.platform.dto.user.UserResponse;

public record LoginResponse(
        String accessToken,
        String refreshToken,
        long expiresInSeconds,
        boolean mustChangePassword,
        UserResponse user
) {
}

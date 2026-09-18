package com.itdesk.platform.dto.auth;

public record RefreshTokenResponse(
        String accessToken,
        long expiresInSeconds
) {
}

package com.itdesk.platform.dto.auth;

import jakarta.validation.constraints.NotBlank;

public record RefreshRequest(
        @NotBlank(message = "Le token de rafraîchissement est obligatoire")
        String refreshToken
) {}

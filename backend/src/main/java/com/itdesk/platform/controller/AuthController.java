package com.itdesk.platform.controller;

import com.itdesk.platform.dto.auth.ChangePasswordRequest;
import com.itdesk.platform.dto.auth.LoginRequest;
import com.itdesk.platform.dto.auth.LoginResponse;
import com.itdesk.platform.dto.auth.RefreshTokenRequest;
import com.itdesk.platform.dto.auth.RefreshTokenResponse;
import com.itdesk.platform.security.CurrentUserProvider;
import com.itdesk.platform.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final CurrentUserProvider currentUserProvider;

    @PostMapping("/login")
    public LoginResponse login(@Valid @RequestBody LoginRequest request) {
        return authService.login(request);
    }

    @PostMapping("/refresh")
    public RefreshTokenResponse refresh(@Valid @RequestBody RefreshTokenRequest request) {
        return authService.refresh(request);
    }

    @PostMapping("/change-password")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void changePassword(@Valid @RequestBody ChangePasswordRequest request) {
        authService.changePassword(currentUserProvider.getCurrentUserId(), request);
    }
}

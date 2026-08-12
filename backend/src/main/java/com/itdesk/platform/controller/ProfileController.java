package com.itdesk.platform.controller;

import com.itdesk.platform.dto.user.UserProfileUpdateRequest;
import com.itdesk.platform.dto.user.UserResponse;
import com.itdesk.platform.security.CurrentUserProvider;
import com.itdesk.platform.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/profile")
@RequiredArgsConstructor
public class ProfileController {

    private final UserService userService;
    private final CurrentUserProvider currentUserProvider;

    @GetMapping
    public UserResponse getProfile() {
        return userService.findById(currentUserProvider.getCurrentUserId());
    }

    @PutMapping
    public UserResponse updateProfile(@Valid @RequestBody UserProfileUpdateRequest request) {
        return userService.updateProfile(currentUserProvider.getCurrentUserId(), request);
    }
}

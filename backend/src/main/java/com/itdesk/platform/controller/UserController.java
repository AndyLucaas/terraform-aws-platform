package com.itdesk.platform.controller;

import com.itdesk.platform.dto.common.PageResponse;
import com.itdesk.platform.dto.user.UserCreateRequest;
import com.itdesk.platform.dto.user.UserResponse;
import com.itdesk.platform.dto.user.UserUpdateRequest;
import com.itdesk.platform.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.net.URI;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMINISTRATOR', 'MANAGER')")
public class UserController {

    private final UserService userService;

    @GetMapping
    public PageResponse<UserResponse> search(
            @RequestParam(required = false) String query,
            @PageableDefault(size = 20, sort = "lastName") Pageable pageable
    ) {
        return userService.search(query, pageable);
    }

    @GetMapping("/{id}")
    public UserResponse findById(@PathVariable Long id) {
        return userService.findById(id);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMINISTRATOR')")
    public ResponseEntity<UserResponse> create(@Valid @RequestBody UserCreateRequest request) {
        UserResponse response = userService.create(request);
        return ResponseEntity.created(URI.create("/api/v1/users/" + response.id())).body(response);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMINISTRATOR')")
    public UserResponse update(@PathVariable Long id, @Valid @RequestBody UserUpdateRequest request) {
        return userService.update(id, request);
    }

    @PostMapping("/{id}/block")
    @PreAuthorize("hasRole('ADMINISTRATOR')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void block(@PathVariable Long id) {
        userService.block(id);
    }

    @PostMapping("/{id}/unblock")
    @PreAuthorize("hasRole('ADMINISTRATOR')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void unblock(@PathVariable Long id) {
        userService.unblock(id);
    }

    @PostMapping("/{id}/reset-password")
    @PreAuthorize("hasRole('ADMINISTRATOR')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void resetPassword(@PathVariable Long id) {
        userService.resetPassword(id);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMINISTRATOR')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        userService.delete(id);
    }
}

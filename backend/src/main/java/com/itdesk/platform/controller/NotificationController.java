package com.itdesk.platform.controller;

import com.itdesk.platform.dto.common.PageResponse;
import com.itdesk.platform.dto.notification.NotificationResponse;
import com.itdesk.platform.security.CurrentUserProvider;
import com.itdesk.platform.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;
    private final CurrentUserProvider currentUserProvider;

    @GetMapping
    public PageResponse<NotificationResponse> findMine(@PageableDefault(size = 20, sort = "createdAt") Pageable pageable) {
        return notificationService.findForUser(currentUserProvider.getCurrentUserId(), pageable);
    }

    @GetMapping("/unread-count")
    public long countUnread() {
        return notificationService.countUnread(currentUserProvider.getCurrentUserId());
    }

    @PostMapping("/{id}/read")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void markAsRead(@PathVariable Long id) {
        notificationService.markAsRead(id);
    }

    @PostMapping("/read-all")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void markAllAsRead() {
        notificationService.markAllAsRead(currentUserProvider.getCurrentUserId());
    }
}

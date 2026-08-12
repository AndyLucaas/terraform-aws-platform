package com.itdesk.platform.service;

import com.itdesk.platform.dto.common.PageResponse;
import com.itdesk.platform.dto.notification.NotificationResponse;
import com.itdesk.platform.entity.Notification;
import com.itdesk.platform.entity.Ticket;
import com.itdesk.platform.entity.User;
import com.itdesk.platform.entity.enums.NotificationType;
import com.itdesk.platform.mapper.NotificationMapper;
import com.itdesk.platform.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final NotificationMapper notificationMapper;

    public PageResponse<NotificationResponse> findForUser(Long userId, Pageable pageable) {
        Page<Notification> page = notificationRepository.findByRecipientIdOrderByCreatedAtDesc(userId, pageable);
        return PageResponse.from(page.map(notificationMapper::toResponse));
    }

    public long countUnread(Long userId) {
        return notificationRepository.countByRecipientIdAndReadFalse(userId);
    }

    @Transactional
    public void notifyUser(User recipient, Ticket ticket, NotificationType type, String title, String message) {
        Notification notification = Notification.builder()
                .recipient(recipient)
                .ticket(ticket)
                .type(type)
                .title(title)
                .message(message)
                .build();
        notificationRepository.save(notification);
    }

    @Transactional
    public void markAsRead(Long notificationId) {
        notificationRepository.findById(notificationId).ifPresent(notification -> {
            notification.setRead(true);
            notification.setReadAt(java.time.Instant.now());
        });
    }

    @Transactional
    public void markAllAsRead(Long userId) {
        notificationRepository.markAllAsRead(userId);
    }
}

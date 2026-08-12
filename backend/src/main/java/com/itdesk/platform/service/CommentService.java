package com.itdesk.platform.service;

import com.itdesk.platform.dto.comment.CommentCreateRequest;
import com.itdesk.platform.dto.comment.CommentResponse;
import com.itdesk.platform.dto.common.PageResponse;
import com.itdesk.platform.entity.Comment;
import com.itdesk.platform.entity.Ticket;
import com.itdesk.platform.entity.User;
import com.itdesk.platform.entity.enums.NotificationType;
import com.itdesk.platform.exception.ResourceNotFoundException;
import com.itdesk.platform.mapper.CommentMapper;
import com.itdesk.platform.repository.CommentRepository;
import com.itdesk.platform.repository.TicketRepository;
import com.itdesk.platform.security.CurrentUserProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CommentService {

    private final CommentRepository commentRepository;
    private final TicketRepository ticketRepository;
    private final CommentMapper commentMapper;
    private final NotificationService notificationService;
    private final CurrentUserProvider currentUserProvider;

    public PageResponse<CommentResponse> findByTicket(Long ticketId, Pageable pageable) {
        Page<Comment> page = commentRepository.findByTicketIdOrderByCreatedAtAsc(ticketId, pageable);
        return PageResponse.from(page.map(commentMapper::toResponse));
    }

    @Transactional
    public CommentResponse create(Long ticketId, CommentCreateRequest request) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket introuvable : " + ticketId));
        User author = currentUserProvider.getCurrentUser();

        Comment comment = Comment.builder()
                .ticket(ticket)
                .author(author)
                .content(request.content())
                .internal(request.internal())
                .build();
        Comment saved = commentRepository.save(comment);

        notifyParticipants(ticket, author);

        return commentMapper.toResponse(saved);
    }

    private void notifyParticipants(Ticket ticket, User author) {
        Set<User> recipients = new HashSet<>();
        if (ticket.getRequester() != null) {
            recipients.add(ticket.getRequester());
        }
        if (ticket.getAssignee() != null) {
            recipients.add(ticket.getAssignee());
        }
        recipients.remove(author);

        recipients.forEach(user -> notificationService.notifyUser(
                user,
                ticket,
                NotificationType.TICKET_COMMENTED,
                "Nouveau commentaire",
                "Un nouveau commentaire a été ajouté au ticket " + ticket.getReference()
        ));
    }
}

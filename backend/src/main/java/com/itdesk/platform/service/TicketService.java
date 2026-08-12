package com.itdesk.platform.service;

import com.itdesk.platform.dto.common.PageResponse;
import com.itdesk.platform.dto.ticket.TicketCreateRequest;
import com.itdesk.platform.dto.ticket.TicketFilterRequest;
import com.itdesk.platform.dto.ticket.TicketResponse;
import com.itdesk.platform.dto.ticket.TicketSummaryResponse;
import com.itdesk.platform.dto.ticket.TicketUpdateRequest;
import com.itdesk.platform.entity.*;
import com.itdesk.platform.entity.enums.NotificationType;
import com.itdesk.platform.exception.ResourceNotFoundException;
import com.itdesk.platform.mapper.TicketMapper;
import com.itdesk.platform.repository.*;
import com.itdesk.platform.security.CurrentUserProvider;
import com.itdesk.platform.specification.TicketSpecifications;
import com.itdesk.platform.util.TicketReferenceGenerator;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TicketService {

    private final TicketRepository ticketRepository;
    private final TicketStatusRepository ticketStatusRepository;
    private final TicketPriorityRepository ticketPriorityRepository;
    private final CategoryRepository categoryRepository;
    private final TagRepository tagRepository;
    private final UserRepository userRepository;
    private final TeamRepository teamRepository;
    private final TicketHistoryRepository ticketHistoryRepository;
    private final TicketMapper ticketMapper;
    private final TicketReferenceGenerator referenceGenerator;
    private final NotificationService notificationService;
    private final CurrentUserProvider currentUserProvider;

    private static final String STATUS_OPEN = "OPEN";

    public PageResponse<TicketSummaryResponse> search(TicketFilterRequest filter, Pageable pageable) {
        Page<Ticket> page = ticketRepository.findAll(TicketSpecifications.fromFilter(filter), pageable);
        return PageResponse.from(page.map(ticketMapper::toSummary));
    }

    public TicketResponse findById(Long id) {
        return ticketMapper.toResponse(getOrThrow(id));
    }

    @Transactional
    public TicketResponse create(TicketCreateRequest request) {
        User requester = currentUserProvider.getCurrentUser();
        TicketStatus openStatus = ticketStatusRepository.findByCode(STATUS_OPEN)
                .orElseThrow(() -> new IllegalStateException("Statut par défaut introuvable : " + STATUS_OPEN));

        Ticket ticket = Ticket.builder()
                .reference("PENDING")
                .title(request.title())
                .description(request.description())
                .status(openStatus)
                .priority(resolvePriority(request.priorityId()))
                .category(resolveCategory(request.categoryId()))
                .requester(requester)
                .assignee(resolveAssignee(request.assigneeId()))
                .team(resolveTeam(request.teamId()))
                .dueDate(request.dueDate())
                .tags(resolveTags(request.tagIds()))
                .build();

        Ticket saved = ticketRepository.save(ticket);
        saved.setReference(referenceGenerator.generate(saved.getId()));

        if (saved.getAssignee() != null) {
            notificationService.notifyUser(
                    saved.getAssignee(),
                    saved,
                    NotificationType.TICKET_ASSIGNED,
                    "Nouveau ticket assigné",
                    "Le ticket " + saved.getReference() + " vous a été assigné."
            );
        }

        return ticketMapper.toResponse(saved);
    }

    @Transactional
    public TicketResponse update(Long id, TicketUpdateRequest request) {
        Ticket ticket = getOrThrow(id);
        User currentUser = currentUserProvider.getCurrentUser();

        recordFieldChange(ticket, currentUser, "title", ticket.getTitle(), request.title());
        ticket.setTitle(request.title());

        ticket.setDescription(request.description());

        TicketStatus newStatus = resolveStatus(request.statusId());
        if (!Objects.equals(ticket.getStatus().getId(), newStatus.getId())) {
            recordFieldChange(ticket, currentUser, "status", ticket.getStatus().getLabel(), newStatus.getLabel());
            applyStatusTransition(ticket, newStatus);
        }

        TicketPriority newPriority = resolvePriority(request.priorityId());
        if (!Objects.equals(ticket.getPriority().getId(), newPriority.getId())) {
            recordFieldChange(ticket, currentUser, "priority", ticket.getPriority().getLabel(), newPriority.getLabel());
            ticket.setPriority(newPriority);
        }

        ticket.setCategory(resolveCategory(request.categoryId()));
        ticket.setDueDate(request.dueDate());
        ticket.setTeam(resolveTeam(request.teamId()));
        ticket.setTags(resolveTags(request.tagIds()));

        User newAssignee = resolveAssignee(request.assigneeId());
        boolean assigneeChanged = !Objects.equals(
                ticket.getAssignee() != null ? ticket.getAssignee().getId() : null,
                newAssignee != null ? newAssignee.getId() : null
        );
        if (assigneeChanged) {
            String oldAssigneeName = ticket.getAssignee() != null
                    ? ticket.getAssignee().getFirstName() + " " + ticket.getAssignee().getLastName() : "Aucun";
            String newAssigneeName = newAssignee != null
                    ? newAssignee.getFirstName() + " " + newAssignee.getLastName() : "Aucun";
            recordFieldChange(ticket, currentUser, "assignee", oldAssigneeName, newAssigneeName);
            ticket.setAssignee(newAssignee);

            if (newAssignee != null) {
                notificationService.notifyUser(
                        newAssignee,
                        ticket,
                        NotificationType.TICKET_ASSIGNED,
                        "Ticket assigné",
                        "Le ticket " + ticket.getReference() + " vous a été assigné."
                );
            }
        }

        return ticketMapper.toResponse(ticket);
    }

    @Transactional
    public void delete(Long id) {
        Ticket ticket = getOrThrow(id);
        ticketRepository.delete(ticket);
    }

    private void applyStatusTransition(Ticket ticket, TicketStatus newStatus) {
        ticket.setStatus(newStatus);
        if (newStatus.isClosedState() && ticket.getResolvedAt() == null) {
            ticket.setResolvedAt(Instant.now());
        }
        if ("CLOSED".equals(newStatus.getCode())) {
            ticket.setClosedAt(Instant.now());
        }

        Set<User> recipients = new HashSet<>();
        if (ticket.getRequester() != null) {
            recipients.add(ticket.getRequester());
        }
        if (ticket.getAssignee() != null) {
            recipients.add(ticket.getAssignee());
        }
        recipients.forEach(user -> notificationService.notifyUser(
                user,
                ticket,
                NotificationType.TICKET_STATUS_CHANGED,
                "Statut du ticket modifié",
                "Le ticket " + ticket.getReference() + " est désormais : " + newStatus.getLabel()
        ));
    }

    private void recordFieldChange(Ticket ticket, User changedBy, String fieldName, String oldValue, String newValue) {
        if (Objects.equals(oldValue, newValue)) {
            return;
        }
        TicketHistory history = TicketHistory.builder()
                .ticket(ticket)
                .changedBy(changedBy)
                .fieldName(fieldName)
                .oldValue(oldValue)
                .newValue(newValue)
                .build();
        ticketHistoryRepository.save(history);
    }

    private Ticket getOrThrow(Long id) {
        return ticketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket introuvable : " + id));
    }

    private TicketStatus resolveStatus(Long id) {
        return ticketStatusRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Statut introuvable : " + id));
    }

    private TicketPriority resolvePriority(Long id) {
        return ticketPriorityRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Priorité introuvable : " + id));
    }

    private Category resolveCategory(Long id) {
        if (id == null) {
            return null;
        }
        return categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Catégorie introuvable : " + id));
    }

    private User resolveAssignee(Long id) {
        if (id == null) {
            return null;
        }
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur introuvable : " + id));
    }

    private Team resolveTeam(Long id) {
        if (id == null) {
            return null;
        }
        return teamRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Équipe introuvable : " + id));
    }

    private Set<Tag> resolveTags(Set<Long> tagIds) {
        if (tagIds == null || tagIds.isEmpty()) {
            return new HashSet<>();
        }
        Set<Tag> tags = tagRepository.findByIdIn(tagIds);
        if (tags.size() != tagIds.size()) {
            throw new ResourceNotFoundException("Un ou plusieurs tags sont invalides : " + tagIds);
        }
        return tags;
    }
}

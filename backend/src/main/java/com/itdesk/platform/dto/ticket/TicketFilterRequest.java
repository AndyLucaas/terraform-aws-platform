package com.itdesk.platform.dto.ticket;

import java.time.Instant;

/**
 * Regroupe l'ensemble des filtres optionnels applicables à la recherche de
 * tickets ; chaque champ nul est ignoré lors de la construction de la
 * Specification JPA correspondante.
 */
public record TicketFilterRequest(
        String search,
        Long statusId,
        Long priorityId,
        Long categoryId,
        Long assigneeId,
        Long requesterId,
        Long teamId,
        Long tagId,
        Instant createdFrom,
        Instant createdTo,
        Boolean overdue
) {
}

package com.itdesk.platform.specification;

import com.itdesk.platform.dto.ticket.TicketFilterRequest;
import com.itdesk.platform.entity.Ticket;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

/**
 * Construit dynamiquement une {@link Specification} JPA à partir des filtres
 * fournis par le client, en n'ajoutant un prédicat que pour les champs
 * effectivement renseignés.
 */
public final class TicketSpecifications {

    private TicketSpecifications() {
    }

    public static Specification<Ticket> fromFilter(TicketFilterRequest filter) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (filter.search() != null && !filter.search().isBlank()) {
                String pattern = "%" + filter.search().toLowerCase() + "%";
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("title")), pattern),
                        cb.like(cb.lower(root.get("reference")), pattern)
                ));
            }
            if (filter.statusId() != null) {
                predicates.add(cb.equal(root.get("status").get("id"), filter.statusId()));
            }
            if (filter.priorityId() != null) {
                predicates.add(cb.equal(root.get("priority").get("id"), filter.priorityId()));
            }
            if (filter.categoryId() != null) {
                predicates.add(cb.equal(root.get("category").get("id"), filter.categoryId()));
            }
            if (filter.assigneeId() != null) {
                predicates.add(cb.equal(root.get("assignee").get("id"), filter.assigneeId()));
            }
            if (filter.requesterId() != null) {
                predicates.add(cb.equal(root.get("requester").get("id"), filter.requesterId()));
            }
            if (filter.teamId() != null) {
                predicates.add(cb.equal(root.get("team").get("id"), filter.teamId()));
            }
            if (filter.tagId() != null) {
                predicates.add(cb.equal(root.join("tags").get("id"), filter.tagId()));
            }
            if (filter.createdFrom() != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("createdAt"), filter.createdFrom()));
            }
            if (filter.createdTo() != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("createdAt"), filter.createdTo()));
            }
            if (Boolean.TRUE.equals(filter.overdue())) {
                predicates.add(cb.and(
                        cb.isNotNull(root.get("dueDate")),
                        cb.lessThan(root.get("dueDate"), cb.literal(Instant.now())),
                        cb.isFalse(root.get("status").get("closedState"))
                ));
            }

            query.distinct(true);
            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}

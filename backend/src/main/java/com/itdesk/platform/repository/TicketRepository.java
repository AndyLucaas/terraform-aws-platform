package com.itdesk.platform.repository;

import com.itdesk.platform.entity.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.util.Optional;

public interface TicketRepository extends JpaRepository<Ticket, Long>, JpaSpecificationExecutor<Ticket> {

    Optional<Ticket> findByReference(String reference);

    long countByStatus_ClosedStateFalse();

    long countByStatus_ClosedStateTrue();

    long countByPriority_Code(String priorityCode);

    long countByStatus_Code(String statusCode);

    long countByCreatedAtGreaterThanEqual(Instant from);

    @Query("""
            select avg(timestampdiff(SECOND, t.createdAt, t.resolvedAt)) / 3600.0
            from Ticket t
            where t.resolvedAt is not null
            """)
    Double findAverageResolutionTimeInHours();

    @Query("select count(t) from Ticket t where t.assignee.id = :userId and t.status.closedState = false")
    long countOpenTicketsByAssignee(@Param("userId") Long userId);
}

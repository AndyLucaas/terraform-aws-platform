package com.itdesk.platform.repository;

import com.itdesk.platform.entity.TicketHistory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TicketHistoryRepository extends JpaRepository<TicketHistory, Long> {

    Page<TicketHistory> findByTicketIdOrderByCreatedAtDesc(Long ticketId, Pageable pageable);
}

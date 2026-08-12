package com.itdesk.platform.repository;

import com.itdesk.platform.entity.TicketStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TicketStatusRepository extends JpaRepository<TicketStatus, Long> {

    Optional<TicketStatus> findByCode(String code);
}

package com.itdesk.platform.repository;

import com.itdesk.platform.entity.TicketPriority;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TicketPriorityRepository extends JpaRepository<TicketPriority, Long> {

    Optional<TicketPriority> findByCode(String code);
}

package com.itdesk.platform.service;

import com.itdesk.platform.dto.common.PageResponse;
import com.itdesk.platform.dto.ticket.TicketHistoryResponse;
import com.itdesk.platform.mapper.TicketHistoryMapper;
import com.itdesk.platform.repository.TicketHistoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TicketHistoryQueryService {

    private final TicketHistoryRepository ticketHistoryRepository;
    private final TicketHistoryMapper ticketHistoryMapper;

    public PageResponse<TicketHistoryResponse> findByTicket(Long ticketId, Pageable pageable) {
        Page<TicketHistoryResponse> page = ticketHistoryRepository
                .findByTicketIdOrderByCreatedAtDesc(ticketId, pageable)
                .map(ticketHistoryMapper::toResponse);
        return PageResponse.from(page);
    }
}

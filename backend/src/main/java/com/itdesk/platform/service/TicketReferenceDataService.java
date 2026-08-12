package com.itdesk.platform.service;

import com.itdesk.platform.dto.ticket.TicketPriorityResponse;
import com.itdesk.platform.dto.ticket.TicketStatusResponse;
import com.itdesk.platform.mapper.TicketReferenceDataMapper;
import com.itdesk.platform.repository.TicketPriorityRepository;
import com.itdesk.platform.repository.TicketStatusRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TicketReferenceDataService {

    private final TicketStatusRepository ticketStatusRepository;
    private final TicketPriorityRepository ticketPriorityRepository;
    private final TicketReferenceDataMapper mapper;

    public List<TicketStatusResponse> findAllStatuses() {
        return ticketStatusRepository.findAll(Sort.by("displayOrder")).stream()
                .map(mapper::toResponse)
                .toList();
    }

    public List<TicketPriorityResponse> findAllPriorities() {
        return ticketPriorityRepository.findAll(Sort.by("displayOrder")).stream()
                .map(mapper::toResponse)
                .toList();
    }
}

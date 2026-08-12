package com.itdesk.platform.controller;

import com.itdesk.platform.dto.ticket.TicketPriorityResponse;
import com.itdesk.platform.dto.ticket.TicketStatusResponse;
import com.itdesk.platform.service.TicketReferenceDataService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/reference-data")
@RequiredArgsConstructor
public class TicketReferenceDataController {

    private final TicketReferenceDataService ticketReferenceDataService;

    @GetMapping("/statuses")
    public List<TicketStatusResponse> statuses() {
        return ticketReferenceDataService.findAllStatuses();
    }

    @GetMapping("/priorities")
    public List<TicketPriorityResponse> priorities() {
        return ticketReferenceDataService.findAllPriorities();
    }
}

package com.itdesk.platform.controller;

import com.itdesk.platform.dto.common.PageResponse;
import com.itdesk.platform.dto.ticket.*;
import com.itdesk.platform.service.TicketService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.time.Instant;

@RestController
@RequestMapping("/api/v1/tickets")
@RequiredArgsConstructor
public class TicketController {

    private final TicketService ticketService;

    @GetMapping
    public PageResponse<TicketSummaryResponse> search(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Long statusId,
            @RequestParam(required = false) Long priorityId,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) Long assigneeId,
            @RequestParam(required = false) Long requesterId,
            @RequestParam(required = false) Long teamId,
            @RequestParam(required = false) Long tagId,
            @RequestParam(required = false) Instant createdFrom,
            @RequestParam(required = false) Instant createdTo,
            @RequestParam(required = false) Boolean overdue,
            @PageableDefault(size = 20, sort = "createdAt") Pageable pageable
    ) {
        TicketFilterRequest filter = new TicketFilterRequest(
                search, statusId, priorityId, categoryId, assigneeId, requesterId, teamId, tagId,
                createdFrom, createdTo, overdue
        );
        return ticketService.search(filter, pageable);
    }

    @GetMapping("/{id}")
    public TicketResponse findById(@PathVariable Long id) {
        return ticketService.findById(id);
    }

    @PostMapping
    public ResponseEntity<TicketResponse> create(@Valid @RequestBody TicketCreateRequest request) {
        TicketResponse response = ticketService.create(request);
        return ResponseEntity.created(URI.create("/api/v1/tickets/" + response.id())).body(response);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMINISTRATOR', 'TECHNICIAN', 'MANAGER')")
    public TicketResponse update(@PathVariable Long id, @Valid @RequestBody TicketUpdateRequest request) {
        return ticketService.update(id, request);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMINISTRATOR')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        ticketService.delete(id);
    }
}

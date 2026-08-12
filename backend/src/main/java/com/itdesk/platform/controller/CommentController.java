package com.itdesk.platform.controller;

import com.itdesk.platform.dto.comment.CommentCreateRequest;
import com.itdesk.platform.dto.comment.CommentResponse;
import com.itdesk.platform.dto.common.PageResponse;
import com.itdesk.platform.service.CommentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;

@RestController
@RequestMapping("/api/v1/tickets/{ticketId}/comments")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    @GetMapping
    public PageResponse<CommentResponse> findByTicket(
            @PathVariable Long ticketId,
            @PageableDefault(size = 20, sort = "createdAt") Pageable pageable
    ) {
        return commentService.findByTicket(ticketId, pageable);
    }

    @PostMapping
    public ResponseEntity<CommentResponse> create(
            @PathVariable Long ticketId,
            @Valid @RequestBody CommentCreateRequest request
    ) {
        CommentResponse response = commentService.create(ticketId, request);
        return ResponseEntity.created(URI.create("/api/v1/tickets/" + ticketId + "/comments/" + response.id()))
                .body(response);
    }
}

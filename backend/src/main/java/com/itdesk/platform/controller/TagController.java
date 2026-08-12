package com.itdesk.platform.controller;

import com.itdesk.platform.dto.ticket.TagResponse;
import com.itdesk.platform.service.TagService;
import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/v1/tags")
@RequiredArgsConstructor
public class TagController {

    private final TagService tagService;

    @GetMapping
    public List<TagResponse> search(@RequestParam(required = false) String query) {
        return tagService.search(query);
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMINISTRATOR', 'MANAGER', 'TECHNICIAN')")
    public ResponseEntity<TagResponse> create(
            @RequestParam @NotBlank String name,
            @RequestParam(required = false) String colorHex
    ) {
        TagResponse response = tagService.create(name, colorHex);
        return ResponseEntity.created(URI.create("/api/v1/tags/" + response.id())).body(response);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMINISTRATOR', 'MANAGER')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        tagService.delete(id);
    }
}

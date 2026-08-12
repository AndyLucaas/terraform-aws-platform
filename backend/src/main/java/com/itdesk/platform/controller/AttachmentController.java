package com.itdesk.platform.controller;

import com.itdesk.platform.dto.attachment.AttachmentResponse;
import com.itdesk.platform.service.AttachmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class AttachmentController {

    private final AttachmentService attachmentService;

    @GetMapping("/api/v1/tickets/{ticketId}/attachments")
    public List<AttachmentResponse> findByTicket(@PathVariable Long ticketId) {
        return attachmentService.findByTicket(ticketId);
    }

    @PostMapping(value = "/api/v1/tickets/{ticketId}/attachments", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<AttachmentResponse> upload(
            @PathVariable Long ticketId,
            @RequestParam(required = false) Long commentId,
            @RequestParam("file") MultipartFile file
    ) {
        AttachmentResponse response = attachmentService.upload(ticketId, commentId, file);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/api/v1/attachments/{attachmentId}/download")
    public ResponseEntity<Resource> download(@PathVariable Long attachmentId) {
        Resource resource = attachmentService.download(attachmentId);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    }

    @DeleteMapping("/api/v1/attachments/{attachmentId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long attachmentId) {
        attachmentService.delete(attachmentId);
    }
}

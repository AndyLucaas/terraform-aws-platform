package com.itdesk.platform.service;

import com.itdesk.platform.dto.attachment.AttachmentResponse;
import com.itdesk.platform.entity.Attachment;
import com.itdesk.platform.entity.Comment;
import com.itdesk.platform.entity.Ticket;
import com.itdesk.platform.entity.User;
import com.itdesk.platform.exception.FileStorageException;
import com.itdesk.platform.exception.ResourceNotFoundException;
import com.itdesk.platform.mapper.AttachmentMapper;
import com.itdesk.platform.repository.AttachmentRepository;
import com.itdesk.platform.repository.CommentRepository;
import com.itdesk.platform.repository.TicketRepository;
import com.itdesk.platform.security.CurrentUserProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AttachmentService {

    private final AttachmentRepository attachmentRepository;
    private final TicketRepository ticketRepository;
    private final CommentRepository commentRepository;
    private final AttachmentMapper attachmentMapper;
    private final CurrentUserProvider currentUserProvider;

    @Value("${app.storage.attachments-path}")
    private String attachmentsPath;

    public List<AttachmentResponse> findByTicket(Long ticketId) {
        return attachmentRepository.findByTicketId(ticketId).stream()
                .map(attachmentMapper::toResponse)
                .toList();
    }

    @Transactional
    public AttachmentResponse upload(Long ticketId, Long commentId, MultipartFile file) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket introuvable : " + ticketId));
        Comment comment = null;
        if (commentId != null) {
            comment = commentRepository.findById(commentId)
                    .orElseThrow(() -> new ResourceNotFoundException("Commentaire introuvable : " + commentId));
        }
        User uploadedBy = currentUserProvider.getCurrentUser();

        String storedFileName = UUID.randomUUID() + "_" + sanitize(file.getOriginalFilename());
        Path destination = resolveStoragePath().resolve(storedFileName);

        try {
            Files.createDirectories(destination.getParent());
            file.transferTo(destination);
        } catch (IOException e) {
            throw new FileStorageException("Impossible d'enregistrer la pièce jointe", e);
        }

        Attachment attachment = Attachment.builder()
                .ticket(ticket)
                .comment(comment)
                .uploadedBy(uploadedBy)
                .fileName(file.getOriginalFilename())
                .storedFileName(storedFileName)
                .contentType(file.getContentType())
                .sizeBytes(file.getSize())
                .build();

        return attachmentMapper.toResponse(attachmentRepository.save(attachment));
    }

    public Resource download(Long attachmentId) {
        Attachment attachment = attachmentRepository.findById(attachmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Pièce jointe introuvable : " + attachmentId));
        return new FileSystemResource(resolveStoragePath().resolve(attachment.getStoredFileName()));
    }

    @Transactional
    public void delete(Long attachmentId) {
        Attachment attachment = attachmentRepository.findById(attachmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Pièce jointe introuvable : " + attachmentId));
        Path filePath = resolveStoragePath().resolve(attachment.getStoredFileName());
        attachmentRepository.delete(attachment);
        try {
            Files.deleteIfExists(filePath);
        } catch (IOException e) {
            throw new FileStorageException("Impossible de supprimer le fichier physique", e);
        }
    }

    private Path resolveStoragePath() {
        return Path.of(attachmentsPath);
    }

    private String sanitize(String originalFileName) {
        if (originalFileName == null) {
            return "fichier";
        }
        return originalFileName.replaceAll("[^a-zA-Z0-9._-]", "_");
    }
}

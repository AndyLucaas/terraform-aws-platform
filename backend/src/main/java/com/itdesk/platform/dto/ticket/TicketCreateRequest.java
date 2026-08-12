package com.itdesk.platform.dto.ticket;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.Instant;
import java.util.Set;

public record TicketCreateRequest(

        @NotBlank(message = "Le titre est obligatoire")
        @Size(max = 200, message = "Le titre ne doit pas dépasser 200 caractères")
        String title,

        @NotBlank(message = "La description est obligatoire")
        String description,

        @NotNull(message = "La priorité est obligatoire")
        Long priorityId,

        Long categoryId,

        Long assigneeId,

        Long teamId,

        Instant dueDate,

        Set<Long> tagIds
) {
}

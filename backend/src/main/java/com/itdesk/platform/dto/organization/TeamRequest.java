package com.itdesk.platform.dto.organization;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record TeamRequest(

        @NotBlank(message = "Le nom de l'équipe est obligatoire")
        @Size(max = 100, message = "Le nom ne doit pas dépasser 100 caractères")
        String name,

        @Size(max = 500, message = "La description ne doit pas dépasser 500 caractères")
        String description,

        @NotNull(message = "Le département est obligatoire")
        Long departmentId
) {
}

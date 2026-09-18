package com.itdesk.platform.dto.user;

import jakarta.validation.constraints.*;

import java.util.Set;

public record UserCreateRequest(

        @NotBlank(message = "Le nom d'utilisateur est obligatoire")
        @Size(max = 100)
        String username,

        @NotBlank(message = "L'email est obligatoire")
        @Email(message = "Format d'email invalide")
        String email,

        @NotBlank(message = "Le prénom est obligatoire")
        @Size(max = 100)
        String firstName,

        @NotBlank(message = "Le nom est obligatoire")
        @Size(max = 100)
        String lastName,

        String phoneNumber,

        String jobTitle,

        Long departmentId,

        Long teamId,

        @NotEmpty(message = "Au moins un rôle doit être attribué")
        Set<String> roleCodes
) {
}

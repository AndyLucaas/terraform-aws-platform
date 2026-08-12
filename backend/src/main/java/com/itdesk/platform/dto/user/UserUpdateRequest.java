package com.itdesk.platform.dto.user;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;

import java.util.Set;

public record UserUpdateRequest(

        @NotBlank
        @Email(message = "Format d'email invalide")
        String email,

        @NotBlank
        @Size(max = 100)
        String firstName,

        @NotBlank
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

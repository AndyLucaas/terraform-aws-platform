package com.itdesk.platform.dto.user;

/**
 * Réponse à la création d'un compte : contient le mot de passe temporaire
 * en clair, la SEULE fois où il est visible. Ne jamais journaliser ni
 * réexposer cette valeur ailleurs.
 */
public record UserCreatedResponse(
        UserResponse user,
        String temporaryPassword
) {
}

package com.itdesk.platform.security;

import com.itdesk.platform.entity.User;
import com.itdesk.platform.exception.ResourceNotFoundException;
import com.itdesk.platform.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

/**
 * Résout l'entité {@link User} locale correspondant à l'utilisateur
 * authentifié. Depuis le passage à l'authentification gérée par le backend,
 * le principal de l'Authentication est directement le username — plus
 * besoin de faire le lien via un identifiant Keycloak externe.
 */
@Component
@RequiredArgsConstructor
public class CurrentUserProvider {

    private final UserRepository userRepository;

    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof String username)) {
            throw new ResourceNotFoundException("Aucun utilisateur authentifié dans le contexte de sécurité");
        }
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur introuvable : " + username));
    }

    public Long getCurrentUserId() {
        return getCurrentUser().getId();
    }
}

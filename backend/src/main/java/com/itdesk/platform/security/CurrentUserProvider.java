package com.itdesk.platform.security;

import com.itdesk.platform.entity.User;
import com.itdesk.platform.exception.ResourceNotFoundException;
import com.itdesk.platform.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
@RequiredArgsConstructor
public class CurrentUserProvider {

    private final UserRepository userRepository;

    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof Jwt jwt)) {
            throw new ResourceNotFoundException("Aucun utilisateur authentifié dans le contexte de sécurité");
        }
        UUID keycloakId = UUID.fromString(jwt.getSubject());
        return userRepository.findByKeycloakId(keycloakId)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur non synchronisé : " + keycloakId));
    }

    public Long getCurrentUserId() {
        return getCurrentUser().getId();
    }
}

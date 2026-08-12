package com.itdesk.platform.security;

import com.itdesk.platform.entity.Role;
import com.itdesk.platform.entity.User;
import com.itdesk.platform.entity.enums.UserStatus;
import com.itdesk.platform.repository.RoleRepository;
import com.itdesk.platform.repository.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.Instant;
import java.util.Set;
import java.util.UUID;

/**
 * Provisionne à la volée l'utilisateur local correspondant à un JWT Keycloak
 * valide mais encore inconnu de la base applicative (premier login). Le rôle
 * par défaut est USER ; les rôles métier plus larges sont accordés explicitement
 * par un administrateur via la gestion des utilisateurs.
 *
 * Plusieurs requêtes issues du même premier login peuvent arriver en parallèle
 * et tenter de provisionner le même utilisateur simultanément ; la contrainte
 * unique sur keycloak_id départage la course, et le perdant se contente de
 * poursuivre sans erreur puisque l'utilisateur existe désormais de toute façon.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class UserProvisioningFilter extends OncePerRequestFilter {

    private static final String DEFAULT_ROLE_CODE = "USER";

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof Jwt jwt) {
            provisionIfAbsent(jwt);
        }
        filterChain.doFilter(request, response);
    }

    private void provisionIfAbsent(Jwt jwt) {
        UUID keycloakId = UUID.fromString(jwt.getSubject());
        userRepository.findByKeycloakId(keycloakId).ifPresentOrElse(
                user -> {
                    user.setLastLoginAt(Instant.now());
                    userRepository.save(user);
                },
                () -> createUserFromJwtSafely(jwt, keycloakId)
        );
    }

    private void createUserFromJwtSafely(Jwt jwt, UUID keycloakId) {
        try {
            createUserFromJwt(jwt, keycloakId);
        } catch (DataIntegrityViolationException e) {
            log.debug("Provisioning concurrent détecté pour {} : un autre thread a déjà créé l'utilisateur", keycloakId);
        }
    }

    private void createUserFromJwt(Jwt jwt, UUID keycloakId) {
        Role defaultRole = roleRepository.findByCode(DEFAULT_ROLE_CODE)
                .orElseThrow(() -> new IllegalStateException("Rôle par défaut introuvable : " + DEFAULT_ROLE_CODE));

        User user = User.builder()
                .keycloakId(keycloakId)
                .username(jwt.getClaimAsString("preferred_username"))
                .email(jwt.getClaimAsString("email"))
                .firstName(jwt.getClaimAsString("given_name"))
                .lastName(jwt.getClaimAsString("family_name"))
                .status(UserStatus.ACTIVE)
                .available(true)
                .roles(Set.of(defaultRole))
                .lastLoginAt(Instant.now())
                .build();

        userRepository.save(user);
    }
}

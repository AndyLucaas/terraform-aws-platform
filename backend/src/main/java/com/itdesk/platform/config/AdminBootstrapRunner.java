package com.itdesk.platform.config;

import com.itdesk.platform.entity.Role;
import com.itdesk.platform.entity.User;
import com.itdesk.platform.entity.enums.UserStatus;
import com.itdesk.platform.repository.RoleRepository;
import com.itdesk.platform.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.keygen.KeyGenerators;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Set;

/**
 * Sans Keycloak, plus personne ne provisionne le tout premier compte
 * administrateur automatiquement. Ce runner vérifie à chaque démarrage si un
 * compte ADMINISTRATOR existe déjà ; sinon, il en crée un avec un mot de
 * passe aléatoire, affiché UNE SEULE FOIS dans les logs — à changer
 * immédiatement à la première connexion (mustChangePassword est forcé à true).
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class AdminBootstrapRunner implements CommandLineRunner {

    private static final String ADMIN_ROLE_CODE = "ADMINISTRATOR";
    private static final String DEFAULT_ADMIN_USERNAME = "admin";

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        boolean adminAlreadyExists = userRepository.findAll().stream()
                .flatMap(user -> user.getRoles().stream())
                .anyMatch(role -> ADMIN_ROLE_CODE.equals(role.getCode()));

        if (adminAlreadyExists) {
            return;
        }

        Role adminRole = roleRepository.findByCode(ADMIN_ROLE_CODE)
                .orElseThrow(() -> new IllegalStateException("Rôle introuvable : " + ADMIN_ROLE_CODE));

        String temporaryPassword = KeyGenerators.string().generateKey();

        User admin = User.builder()
                .username(DEFAULT_ADMIN_USERNAME)
                .email("admin@itdesk.local")
                .firstName("Admin")
                .lastName("Système")
                .passwordHash(passwordEncoder.encode(temporaryPassword))
                .mustChangePassword(true)
                .status(UserStatus.ACTIVE)
                .available(true)
                .roles(Set.of(adminRole))
                .build();

        userRepository.save(admin);

        log.warn("""

                ================================================================
                Premier démarrage : compte administrateur créé automatiquement.
                  Utilisateur : {}
                  Mot de passe : {}
                Ce mot de passe ne sera plus jamais affiché. Connectez-vous et
                changez-le immédiatement (un changement est de toute façon exigé
                à la première connexion).
                ================================================================
                """, DEFAULT_ADMIN_USERNAME, temporaryPassword);
    }
}

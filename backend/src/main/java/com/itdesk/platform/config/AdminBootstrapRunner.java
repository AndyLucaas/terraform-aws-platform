package com.itdesk.platform.config;

import com.itdesk.platform.entity.Role;
import com.itdesk.platform.entity.User;
import com.itdesk.platform.entity.enums.UserStatus;
import com.itdesk.platform.repository.RoleRepository;
import com.itdesk.platform.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Set;


@Slf4j
@Component
@RequiredArgsConstructor
public class AdminBootstrapRunner implements CommandLineRunner {

    private static final String ADMIN_ROLE_CODE = "ADMINISTRATOR";
    private static final String DEFAULT_ADMIN_USERNAME = "admin";
    private static final String DEFAULT_ADMIN_PASSWORD = "Pcgammer06!";

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

        User admin = User.builder()
                .username(DEFAULT_ADMIN_USERNAME)
                .email("admin@itdesk.local")
                .firstName("Admin")
                .lastName("Système")
                .passwordHash(passwordEncoder.encode(DEFAULT_ADMIN_PASSWORD))
                .mustChangePassword(false)
                .status(UserStatus.ACTIVE)
                .available(true)
                .roles(Set.of(adminRole))
                .build();

        userRepository.save(admin);

        log.info("""

                ================================================================
                Premier démarrage : compte administrateur initialisé.
                  Utilisateur : {}
                  Mot de passe par défaut : {}
                ================================================================
                """, DEFAULT_ADMIN_USERNAME, DEFAULT_ADMIN_PASSWORD);
    }
}

package com.itdesk.platform.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClient;

import java.util.Map;
import java.util.UUID;

/**
 * Encapsule les appels à l'API d'administration Keycloak nécessaires à la
 * gestion du cycle de vie des comptes (activation/désactivation, réinitialisation
 * de mot de passe) déclenchée depuis la plateforme.
 */
@Slf4j
@Service
public class KeycloakAdminService {

    private final RestClient restClient;
    private final String realm;
    private final String adminClientId;
    private final String adminClientSecret;
    private final String tokenUri;

    public KeycloakAdminService(
            @Value("${app.keycloak.admin-base-url}") String adminBaseUrl,
            @Value("${app.keycloak.realm}") String realm,
            @Value("${app.keycloak.admin-client-id}") String adminClientId,
            @Value("${app.keycloak.admin-client-secret}") String adminClientSecret,
            @Value("${app.keycloak.token-uri}") String tokenUri
    ) {
        this.restClient = RestClient.create(adminBaseUrl);
        this.realm = realm;
        this.adminClientId = adminClientId;
        this.adminClientSecret = adminClientSecret;
        this.tokenUri = tokenUri;
    }

    public void setUserEnabled(UUID keycloakId, boolean enabled) {
        restClient.put()
                .uri("/admin/realms/{realm}/users/{id}", realm, keycloakId)
                .header("Authorization", "Bearer " + fetchAdminToken())
                .contentType(MediaType.APPLICATION_JSON)
                .body(Map.of("enabled", enabled))
                .retrieve()
                .toBodilessEntity();
    }

    public void resetPassword(UUID keycloakId, String temporaryPassword) {
        Map<String, Object> credential = Map.of(
                "type", "password",
                "value", temporaryPassword,
                "temporary", true
        );
        restClient.put()
                .uri("/admin/realms/{realm}/users/{id}/reset-password", realm, keycloakId)
                .header("Authorization", "Bearer " + fetchAdminToken())
                .contentType(MediaType.APPLICATION_JSON)
                .body(credential)
                .retrieve()
                .toBodilessEntity();
    }

    private String fetchAdminToken() {
        MultiValueMap<String, String> form = new LinkedMultiValueMap<>();
        form.add("grant_type", "client_credentials");
        form.add("client_id", adminClientId);
        form.add("client_secret", adminClientSecret);

        TokenResponse response = RestClient.create()
                .post()
                .uri(tokenUri)
                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .body(form)
                .retrieve()
                .body(TokenResponse.class);

        return response != null ? response.accessToken() : "";
    }

    private record TokenResponse(String access_token) {
        String accessToken() {
            return access_token;
        }
    }
}

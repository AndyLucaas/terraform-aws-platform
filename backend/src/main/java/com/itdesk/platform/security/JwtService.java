package com.itdesk.platform.security;

import com.itdesk.platform.entity.Role;
import com.itdesk.platform.entity.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Émet et valide les JWT du backend. Contrairement au flux Keycloak
 * précédent, il n'y a plus de tiers externe : cette classe est la seule
 * source de vérité pour "ce token est-il valide, et pour qui".
 *
 * Deux types de token, distingués par le claim "type", pour qu'un refresh
 * token dérobé ne puisse pas être utilisé directement comme token d'accès :
 * - ACCESS  : courte durée de vie, envoyé à chaque appel API
 * - REFRESH : longue durée de vie, sert uniquement à obtenir un nouvel access token
 */
@Component
public class JwtService {

    private static final String CLAIM_TYPE = "type";
    private static final String CLAIM_ROLES = "roles";
    private static final String TYPE_ACCESS = "ACCESS";
    private static final String TYPE_REFRESH = "REFRESH";

    private final SecretKey signingKey;
    private final long accessTokenValiditySeconds;
    private final long refreshTokenValiditySeconds;

    public JwtService(
            @Value("${app.jwt.secret}") String secret,
            @Value("${app.jwt.access-token-validity-seconds}") long accessTokenValiditySeconds,
            @Value("${app.jwt.refresh-token-validity-seconds}") long refreshTokenValiditySeconds
    ) {
        if (secret == null || secret.getBytes().length < 32) {
            throw new IllegalStateException(
                    "app.jwt.secret doit faire au moins 32 caractères (256 bits) pour HS256");
        }
        this.signingKey = Keys.hmacShaKeyFor(secret.getBytes());
        this.accessTokenValiditySeconds = accessTokenValiditySeconds;
        this.refreshTokenValiditySeconds = refreshTokenValiditySeconds;
    }

    public String generateAccessToken(User user) {
        return buildToken(user, TYPE_ACCESS, accessTokenValiditySeconds);
    }

    public String generateRefreshToken(User user) {
        return buildToken(user, TYPE_REFRESH, refreshTokenValiditySeconds);
    }

    public long getAccessTokenValiditySeconds() {
        return accessTokenValiditySeconds;
    }

    private String buildToken(User user, String type, long validitySeconds) {
        Instant now = Instant.now();
        Set<String> roleCodes = user.getRoles().stream().map(Role::getCode).collect(Collectors.toSet());

        return Jwts.builder()
                .subject(user.getUsername())
                .claim("userId", user.getId())
                .claim(CLAIM_ROLES, roleCodes)
                .claim(CLAIM_TYPE, type)
                .issuedAt(Date.from(now))
                .expiration(Date.from(now.plus(validitySeconds, ChronoUnit.SECONDS)))
                .signWith(signingKey)
                .compact();
    }

    /**
     * Valide la signature et l'expiration, puis vérifie que le token est bien
     * du type attendu (ACCESS pour l'API, REFRESH pour /auth/refresh).
     * Lève une JwtException sur tout token invalide, expiré, ou du mauvais type.
     */
    public Claims parseAndValidate(String token, boolean expectAccessToken) {
        Claims claims = Jwts.parser()
                .verifyWith(signingKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();

        String actualType = claims.get(CLAIM_TYPE, String.class);
        String expectedType = expectAccessToken ? TYPE_ACCESS : TYPE_REFRESH;
        if (!expectedType.equals(actualType)) {
            throw new JwtException("Type de token invalide : attendu " + expectedType + ", reçu " + actualType);
        }

        return claims;
    }

    @SuppressWarnings("unchecked")
    public List<String> extractRoles(Claims claims) {
        return (List<String>) claims.get(CLAIM_ROLES, List.class);
    }

    public Long extractUserId(Claims claims) {
        return claims.get("userId", Long.class);
    }
}

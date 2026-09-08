package com.itdesk.platform.security;

import com.itdesk.platform.entity.Role;
import com.itdesk.platform.entity.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

class JwtTokenProviderTest {

    private JwtTokenProvider jwtTokenProvider;

    @BeforeEach
    void setUp() {
        jwtTokenProvider = new JwtTokenProvider(
                "404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970",
                3600000,
                604800000
        );
    }

    @Test
    void testGenerateAndValidateAccessToken() {
        Role role = Role.builder().code("ADMINISTRATOR").name("Admin").build();
        User user = User.builder()
                .id(1L)
                .username("john.doe")
                .email("john@example.com")
                .firstName("John")
                .lastName("Doe")
                .roles(Set.of(role))
                .build();

        String token = jwtTokenProvider.generateAccessToken(user);
        assertNotNull(token);
        assertTrue(jwtTokenProvider.validateToken(token));
        assertEquals("john.doe", jwtTokenProvider.getUsernameFromToken(token));
    }

    @Test
    void testGenerateAndValidateRefreshToken() {
        User user = User.builder()
                .id(1L)
                .username("john.doe")
                .build();

        String refreshToken = jwtTokenProvider.generateRefreshToken(user);
        assertNotNull(refreshToken);
        assertTrue(jwtTokenProvider.validateToken(refreshToken));
        assertEquals("john.doe", jwtTokenProvider.getUsernameFromToken(refreshToken));
    }

    @Test
    void testInvalidToken() {
        assertFalse(jwtTokenProvider.validateToken("invalid.jwt.token"));
    }

    @Test
    void testExpiredToken() {
        JwtTokenProvider shortLivedProvider = new JwtTokenProvider(
                "404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970",
                -1000, // Expired 1 sec ago
                -1000
        );
        User user = User.builder().username("john.doe").roles(Set.of()).build();
        String expiredToken = shortLivedProvider.generateAccessToken(user);
        assertFalse(shortLivedProvider.validateToken(expiredToken));
    }
}

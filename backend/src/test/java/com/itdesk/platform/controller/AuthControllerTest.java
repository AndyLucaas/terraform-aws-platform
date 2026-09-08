package com.itdesk.platform.controller;

import com.itdesk.platform.dto.auth.AuthResponse;
import com.itdesk.platform.dto.auth.LoginRequest;
import com.itdesk.platform.dto.auth.RefreshRequest;
import com.itdesk.platform.dto.user.UserResponse;
import com.itdesk.platform.entity.Role;
import com.itdesk.platform.entity.User;
import com.itdesk.platform.entity.enums.UserStatus;
import com.itdesk.platform.mapper.UserMapper;
import com.itdesk.platform.repository.UserRepository;
import com.itdesk.platform.security.CurrentUserProvider;
import com.itdesk.platform.security.JwtTokenProvider;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthControllerTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtTokenProvider jwtTokenProvider;

    @Mock
    private UserMapper userMapper;

    @Mock
    private CurrentUserProvider currentUserProvider;

    @InjectMocks
    private AuthController authController;

    private User testUser;
    private UserResponse testUserResponse;

    @BeforeEach
    void setUp() {
        Role role = Role.builder().code("ADMINISTRATOR").name("Admin").build();
        testUser = User.builder()
                .id(1L)
                .username("admin")
                .email("admin@itdesk.com")
                .password("encoded_pass")
                .status(UserStatus.ACTIVE)
                .roles(Set.of(role))
                .build();

        testUserResponse = new UserResponse(
                1L, "admin", "admin@itdesk.com", "Admin", "User",
                null, null, null, null, null, null, null, "ACTIVE", true, "fr", Set.of("ADMINISTRATOR"), null, null
        );
    }

    @Test
    void testLoginSuccess() {
        LoginRequest request = new LoginRequest("admin", "password");

        when(userRepository.findByUsername("admin")).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches("password", "encoded_pass")).thenReturn(true);
        when(jwtTokenProvider.generateAccessToken(testUser)).thenReturn("access_token");
        when(jwtTokenProvider.generateRefreshToken(testUser)).thenReturn("refresh_token");
        when(userMapper.toResponse(testUser)).thenReturn(testUserResponse);

        AuthResponse response = authController.login(request);

        assertNotNull(response);
        assertEquals("access_token", response.accessToken());
        assertEquals("refresh_token", response.refreshToken());
        assertEquals("Bearer", response.tokenType());
    }

    @Test
    void testLoginInvalidCredentials() {
        LoginRequest request = new LoginRequest("admin", "wrong_password");

        when(userRepository.findByUsername("admin")).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches("wrong_password", "encoded_pass")).thenReturn(false);

        assertThrows(BadCredentialsException.class, () -> authController.login(request));
    }

    @Test
    void testLoginBlockedUser() {
        testUser.setStatus(UserStatus.BLOCKED);
        LoginRequest request = new LoginRequest("admin", "password");

        when(userRepository.findByUsername("admin")).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches("password", "encoded_pass")).thenReturn(true);

        assertThrows(BadCredentialsException.class, () -> authController.login(request));
    }

    @Test
    void testRefreshSuccess() {
        RefreshRequest request = new RefreshRequest("valid_refresh_token");

        when(jwtTokenProvider.validateToken("valid_refresh_token")).thenReturn(true);
        when(jwtTokenProvider.getUsernameFromToken("valid_refresh_token")).thenReturn("admin");
        when(userRepository.findByUsername("admin")).thenReturn(Optional.of(testUser));
        when(jwtTokenProvider.generateAccessToken(testUser)).thenReturn("new_access_token");
        when(jwtTokenProvider.generateRefreshToken(testUser)).thenReturn("new_refresh_token");
        when(userMapper.toResponse(testUser)).thenReturn(testUserResponse);

        AuthResponse response = authController.refresh(request);

        assertNotNull(response);
        assertEquals("new_access_token", response.accessToken());
        assertEquals("new_refresh_token", response.refreshToken());
    }
}

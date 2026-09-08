package com.itdesk.platform.controller;

import com.itdesk.platform.dto.auth.AuthResponse;
import com.itdesk.platform.dto.auth.LoginRequest;
import com.itdesk.platform.dto.auth.RefreshRequest;
import com.itdesk.platform.dto.user.UserResponse;
import com.itdesk.platform.entity.User;
import com.itdesk.platform.entity.enums.UserStatus;
import com.itdesk.platform.exception.ResourceNotFoundException;
import com.itdesk.platform.mapper.UserMapper;
import com.itdesk.platform.repository.UserRepository;
import com.itdesk.platform.security.CurrentUserProvider;
import com.itdesk.platform.security.JwtTokenProvider;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserMapper userMapper;
    private final CurrentUserProvider currentUserProvider;

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest request) {
        User user = userRepository.findByUsername(request.username())
                .or(() -> userRepository.findByEmailIgnoreCase(request.username()))
                .orElseThrow(() -> new BadCredentialsException("Identifiants invalides"));

        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            throw new BadCredentialsException("Identifiants invalides");
        }

        if (user.getStatus() == UserStatus.BLOCKED) {
            throw new BadCredentialsException("Le compte utilisateur est bloqué");
        }

        user.setLastLoginAt(Instant.now());
        userRepository.save(user);

        String accessToken = jwtTokenProvider.generateAccessToken(user);
        String refreshToken = jwtTokenProvider.generateRefreshToken(user);

        return new AuthResponse(
                accessToken,
                refreshToken,
                "Bearer",
                3600,
                userMapper.toResponse(user)
        );
    }

    @PostMapping("/refresh")
    public AuthResponse refresh(@Valid @RequestBody RefreshRequest request) {
        if (!jwtTokenProvider.validateToken(request.refreshToken())) {
            throw new BadCredentialsException("Token de rafraîchissement invalide ou expiré");
        }

        String username = jwtTokenProvider.getUsernameFromToken(request.refreshToken());
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur introuvable"));

        if (user.getStatus() == UserStatus.BLOCKED) {
            throw new BadCredentialsException("Le compte utilisateur est bloqué");
        }

        String newAccessToken = jwtTokenProvider.generateAccessToken(user);
        String newRefreshToken = jwtTokenProvider.generateRefreshToken(user);

        return new AuthResponse(
                newAccessToken,
                newRefreshToken,
                "Bearer",
                3600,
                userMapper.toResponse(user)
        );
    }

    @PostMapping("/logout")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void logout() {
        // Déconnexion côté serveur si nécessaire (stateless JWT)
    }

    @GetMapping("/me")
    public UserResponse me() {
        User user = currentUserProvider.getCurrentUser();
        return userMapper.toResponse(user);
    }
}

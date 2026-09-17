package com.itdesk.platform.service;

import com.itdesk.platform.dto.auth.ChangePasswordRequest;
import com.itdesk.platform.dto.auth.LoginRequest;
import com.itdesk.platform.dto.auth.LoginResponse;
import com.itdesk.platform.dto.auth.RefreshTokenRequest;
import com.itdesk.platform.dto.auth.RefreshTokenResponse;
import com.itdesk.platform.entity.User;
import com.itdesk.platform.entity.enums.UserStatus;
import com.itdesk.platform.exception.BusinessRuleException;
import com.itdesk.platform.exception.ResourceNotFoundException;
import com.itdesk.platform.mapper.UserMapper;
import com.itdesk.platform.repository.UserRepository;
import com.itdesk.platform.security.JwtService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

@Service
@RequiredArgsConstructor
@Transactional
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;

    public LoginResponse login(LoginRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.username(), request.password())
            );
        } catch (BadCredentialsException e) {
            throw new BusinessRuleException("Nom d'utilisateur ou mot de passe incorrect");
        } catch (DisabledException e) {
            throw new BusinessRuleException("Ce compte n'est pas encore activé");
        } catch (LockedException e) {
            throw new BusinessRuleException("Ce compte a été bloqué par un administrateur");
        }

        User user = userRepository.findByUsername(request.username())
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur introuvable : " + request.username()));

        user.setLastLoginAt(Instant.now());

        return new LoginResponse(
                jwtService.generateAccessToken(user),
                jwtService.generateRefreshToken(user),
                jwtService.getAccessTokenValiditySeconds(),
                user.isMustChangePassword(),
                userMapper.toResponse(user)
        );
    }

    public RefreshTokenResponse refresh(RefreshTokenRequest request) {
        Claims claims;
        try {
            claims = jwtService.parseAndValidate(request.refreshToken(), false);
        } catch (JwtException e) {
            throw new BusinessRuleException("Refresh token invalide ou expiré, veuillez vous reconnecter");
        }

        User user = userRepository.findByUsername(claims.getSubject())
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur introuvable"));

        if (user.getStatus() != UserStatus.ACTIVE) {
            throw new BusinessRuleException("Ce compte n'est plus actif");
        }

        return new RefreshTokenResponse(
                jwtService.generateAccessToken(user),
                jwtService.getAccessTokenValiditySeconds()
        );
    }

    public void changePassword(Long userId, ChangePasswordRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur introuvable : " + userId));

        if (!passwordEncoder.matches(request.currentPassword(), user.getPasswordHash())) {
            throw new BusinessRuleException("Le mot de passe actuel est incorrect");
        }

        user.setPasswordHash(passwordEncoder.encode(request.newPassword()));
        user.setMustChangePassword(false);
    }
}

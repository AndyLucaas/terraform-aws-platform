package com.itdesk.platform.service;

import com.itdesk.platform.dto.common.PageResponse;
import com.itdesk.platform.dto.user.UserCreateRequest;
import com.itdesk.platform.dto.user.UserProfileUpdateRequest;
import com.itdesk.platform.dto.user.UserResponse;
import com.itdesk.platform.dto.user.UserUpdateRequest;
import com.itdesk.platform.entity.Department;
import com.itdesk.platform.entity.Role;
import com.itdesk.platform.entity.Team;
import com.itdesk.platform.entity.User;
import com.itdesk.platform.entity.enums.UserStatus;
import com.itdesk.platform.exception.DuplicateResourceException;
import com.itdesk.platform.exception.ResourceNotFoundException;
import com.itdesk.platform.mapper.UserMapper;
import com.itdesk.platform.repository.DepartmentRepository;
import com.itdesk.platform.repository.RoleRepository;
import com.itdesk.platform.repository.TeamRepository;
import com.itdesk.platform.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.crypto.keygen.KeyGenerators;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserService {

    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;
    private final TeamRepository teamRepository;
    private final RoleRepository roleRepository;
    private final UserMapper userMapper;
    private final KeycloakAdminService keycloakAdminService;

    public PageResponse<UserResponse> search(String query, Pageable pageable) {
        Specification<User> specification = (root, criteriaQuery, cb) -> {
            if (!StringUtils.hasText(query)) {
                return cb.conjunction();
            }
            String pattern = "%" + query.toLowerCase() + "%";
            return cb.or(
                    cb.like(cb.lower(root.get("username")), pattern),
                    cb.like(cb.lower(root.get("email")), pattern),
                    cb.like(cb.lower(root.get("firstName")), pattern),
                    cb.like(cb.lower(root.get("lastName")), pattern)
            );
        };
        Page<User> page = userRepository.findAll(specification, pageable);
        return PageResponse.from(page.map(userMapper::toResponse));
    }

    public UserResponse findById(Long id) {
        return userMapper.toResponse(getOrThrow(id));
    }

    @Transactional
    public UserResponse create(UserCreateRequest request) {
        if (userRepository.existsByUsernameIgnoreCase(request.username())) {
            throw new DuplicateResourceException("Le nom d'utilisateur '" + request.username() + "' est déjà utilisé");
        }
        if (userRepository.existsByEmailIgnoreCase(request.email())) {
            throw new DuplicateResourceException("L'email '" + request.email() + "' est déjà utilisé");
        }

        User user = User.builder()
                .keycloakId(UUID.randomUUID())
                .username(request.username())
                .email(request.email())
                .firstName(request.firstName())
                .lastName(request.lastName())
                .phoneNumber(request.phoneNumber())
                .jobTitle(request.jobTitle())
                .department(resolveDepartment(request.departmentId()))
                .team(resolveTeam(request.teamId()))
                .status(UserStatus.PENDING)
                .available(true)
                .roles(resolveRoles(request.roleCodes()))
                .build();

        return userMapper.toResponse(userRepository.save(user));
    }

    @Transactional
    public UserResponse update(Long id, UserUpdateRequest request) {
        User user = getOrThrow(id);

        if (!user.getEmail().equalsIgnoreCase(request.email()) && userRepository.existsByEmailIgnoreCase(request.email())) {
            throw new DuplicateResourceException("L'email '" + request.email() + "' est déjà utilisé");
        }

        user.setEmail(request.email());
        user.setFirstName(request.firstName());
        user.setLastName(request.lastName());
        user.setPhoneNumber(request.phoneNumber());
        user.setJobTitle(request.jobTitle());
        user.setDepartment(resolveDepartment(request.departmentId()));
        user.setTeam(resolveTeam(request.teamId()));
        user.setRoles(resolveRoles(request.roleCodes()));

        return userMapper.toResponse(user);
    }

    @Transactional
    public UserResponse updateProfile(Long id, UserProfileUpdateRequest request) {
        User user = getOrThrow(id);
        user.setFirstName(request.firstName());
        user.setLastName(request.lastName());
        user.setPhoneNumber(request.phoneNumber());
        user.setJobTitle(request.jobTitle());
        if (StringUtils.hasText(request.avatarUrl())) {
            user.setAvatarUrl(request.avatarUrl());
        }
        if (StringUtils.hasText(request.locale())) {
            user.setLocale(request.locale());
        }
        return userMapper.toResponse(user);
    }

    @Transactional
    public void block(Long id) {
        User user = getOrThrow(id);
        user.setStatus(UserStatus.BLOCKED);
        keycloakAdminService.setUserEnabled(user.getKeycloakId(), false);
    }

    @Transactional
    public void unblock(Long id) {
        User user = getOrThrow(id);
        user.setStatus(UserStatus.ACTIVE);
        keycloakAdminService.setUserEnabled(user.getKeycloakId(), true);
    }

    @Transactional
    public void resetPassword(Long id) {
        User user = getOrThrow(id);
        String temporaryPassword = KeyGenerators.string().generateKey();
        keycloakAdminService.resetPassword(user.getKeycloakId(), temporaryPassword);
    }

    @Transactional
    public void delete(Long id) {
        User user = getOrThrow(id);
        userRepository.delete(user);
    }

    private User getOrThrow(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur introuvable : " + id));
    }

    private Department resolveDepartment(Long departmentId) {
        if (departmentId == null) {
            return null;
        }
        return departmentRepository.findById(departmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Département introuvable : " + departmentId));
    }

    private Team resolveTeam(Long teamId) {
        if (teamId == null) {
            return null;
        }
        return teamRepository.findById(teamId)
                .orElseThrow(() -> new ResourceNotFoundException("Équipe introuvable : " + teamId));
    }

    private Set<Role> resolveRoles(Set<String> roleCodes) {
        Set<Role> roles = roleRepository.findByCodeIn(roleCodes);
        if (roles.size() != roleCodes.size()) {
            throw new ResourceNotFoundException("Un ou plusieurs rôles sont invalides : " + roleCodes);
        }
        return roles;
    }
}

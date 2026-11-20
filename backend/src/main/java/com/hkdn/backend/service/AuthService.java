package com.hkdn.backend.service;

import com.hkdn.backend.dto.LoginResponse;
import com.hkdn.backend.dto.UserResponse;
import com.hkdn.backend.dto.RoleResponse;
import com.hkdn.backend.entity.User;
import com.hkdn.backend.repository.UserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedHashSet;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final JwtService jwtService;

    public AuthService(
            AuthenticationManager authenticationManager,
            UserRepository userRepository,
            JwtService jwtService) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }

    @Transactional(readOnly = true)
    public LoginResponse login(String email, String password) {
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(email, password));

        User user = userRepository.findWithRolesByEmailIgnoreCase(email)
            .orElseThrow(() -> new IllegalStateException("Authenticated user no longer exists"));

        return new LoginResponse(
            jwtService.issueAccessToken(user),
            "Bearer",
            jwtService.getAccessTokenTtlSeconds(),
            toResponse(user));
    }

    @Transactional(readOnly = true)
    public UserResponse getUserById(java.util.UUID id) {
        return userRepository.findWithRolesById(id)
            .map(this::toResponse)
            .orElseThrow(() -> new IllegalStateException("Authenticated user no longer exists"));
    }

    private UserResponse toResponse(User user) {
        return new UserResponse(
            user.getId(),
            user.getEmail(),
            user.getFullName(),
            user.isEnabled(),
            user.isLocked(),
            user.getCreatedAt(),
            user.getUpdatedAt(),
            user.getRoles().stream()
                .map(role -> new RoleResponse(role.getId(), role.getCode(), role.getName()))
                .collect(java.util.stream.Collectors.toCollection(LinkedHashSet::new)));
    }
}

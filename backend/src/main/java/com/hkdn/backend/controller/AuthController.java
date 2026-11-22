package com.hkdn.backend.controller;

import com.hkdn.backend.dto.LoginRequest;
import com.hkdn.backend.dto.LoginResponse;
import com.hkdn.backend.dto.UserResponse;
import com.hkdn.backend.dto.ChangePasswordRequest;
import com.hkdn.backend.dto.RegisterRequest;
import com.hkdn.backend.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public LoginResponse login(@Valid @RequestBody LoginRequest request) {
        return authService.login(request.email(), request.password());
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public UserResponse register(@Valid @RequestBody RegisterRequest request) {
        return authService.register(request);
    }

    @GetMapping("/me")
    public UserResponse me(@AuthenticationPrincipal Jwt jwt) {
        try {
            return authService.getUserById(UUID.fromString(jwt.getSubject()));
        } catch (IllegalArgumentException exception) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid token subject", exception);
        }
    }

    @PostMapping("/change-password")
    public void changePassword(@AuthenticationPrincipal Jwt jwt, @Valid @RequestBody ChangePasswordRequest request) {
        try { authService.changePassword(UUID.fromString(jwt.getSubject()), request); }
        catch (IllegalArgumentException exception) { throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid token subject"); }
    }

    @PostMapping("/logout")
    public java.util.Map<String,String> logout() { return java.util.Map.of("status", "logged_out"); }
}

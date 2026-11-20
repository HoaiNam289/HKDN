package com.hkdn.backend.service;

import com.hkdn.backend.entity.User;
import com.hkdn.backend.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AccountStatusException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.LockedException;

import java.lang.reflect.Constructor;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private UserRepository userRepository;

    @Mock
    private JwtService jwtService;

    private AuthService authService;

    @BeforeEach
    void setUp() {
        authService = new AuthService(authenticationManager, userRepository, jwtService);
    }

    @Test
    void loginReturnsTokenAndSafeUserResponse() throws Exception {
        User user = testUser();
        when(userRepository.findWithRolesByEmailIgnoreCase(user.getEmail())).thenReturn(Optional.of(user));
        when(jwtService.issueAccessToken(user)).thenReturn("test-access-token");
        when(jwtService.getAccessTokenTtlSeconds()).thenReturn(900L);

        var response = authService.login(user.getEmail(), "test-password");

        assertEquals("test-access-token", response.accessToken());
        assertEquals("Bearer", response.tokenType());
        assertEquals(900L, response.expiresIn());
        assertEquals(user.getEmail(), response.user().email());
        verify(authenticationManager).authenticate(any());
    }

    @Test
    void loginRejectsWrongPassword() {
        when(authenticationManager.authenticate(any()))
            .thenThrow(new BadCredentialsException("invalid credentials"));

        assertThrows(BadCredentialsException.class,
            () -> authService.login("user@example.com", "wrong-password"));
        verify(userRepository, never()).findWithRolesByEmailIgnoreCase(any());
    }

    @Test
    void loginRejectsUnknownEmail() {
        when(authenticationManager.authenticate(any()))
            .thenThrow(new BadCredentialsException("invalid credentials"));

        assertThrows(BadCredentialsException.class,
            () -> authService.login("missing@example.com", "password"));
    }

    @Test
    void loginRejectsLockedAccount() {
        when(authenticationManager.authenticate(any()))
            .thenThrow(new LockedException("account locked"));

        assertThrows(AccountStatusException.class,
            () -> authService.login("locked@example.com", "password"));
    }

    @Test
    void loginRejectsDisabledAccount() {
        when(authenticationManager.authenticate(any()))
            .thenThrow(new DisabledException("account disabled"));

        assertThrows(AccountStatusException.class,
            () -> authService.login("disabled@example.com", "password"));
    }

    private User testUser() throws Exception {
        Constructor<User> constructor = User.class.getDeclaredConstructor();
        constructor.setAccessible(true);

        User user = constructor.newInstance();
        user.setId(UUID.randomUUID());
        user.setEmail("issuer@example.com");
        user.setPasswordHash("$2a$12$test-only-hash");
        user.setFullName("Test Issuer");
        return user;
    }
}

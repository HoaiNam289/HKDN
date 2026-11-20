package com.hkdn.backend.service;

import com.hkdn.backend.entity.Role;
import com.hkdn.backend.entity.User;
import com.hkdn.backend.repository.RoleRepository;
import com.hkdn.backend.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.lang.reflect.Constructor;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AdminBootstrapRunnerTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private RoleRepository roleRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    private Role adminRole;

    @BeforeEach
    void setUp() throws Exception {
        Constructor<Role> constructor = Role.class.getDeclaredConstructor();
        constructor.setAccessible(true);
        adminRole = constructor.newInstance();
        adminRole.setCode("ADMIN");
        adminRole.setName("Quản trị viên");
    }

    @Test
    void createsAdminWithBcryptHashAndAdminRole() {
        when(roleRepository.findByCode("ADMIN")).thenReturn(Optional.of(adminRole));
        when(userRepository.existsByRoleCode("ADMIN")).thenReturn(false);
        when(passwordEncoder.encode("development-admin-password"))
            .thenReturn("$2a$12$test-bcrypt-hash");

        AdminBootstrapRunner runner = runner("Admin@Example.com", "development-admin-password");
        runner.run(null);

        ArgumentCaptor<User> captor = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(captor.capture());
        User saved = captor.getValue();

        assertEquals("admin@example.com", saved.getEmail());
        assertEquals("$2a$12$test-bcrypt-hash", saved.getPasswordHash());
        assertTrue(saved.getRoles().contains(adminRole));
        verify(passwordEncoder).encode("development-admin-password");
    }

    @Test
    void doesNotCreateDuplicateWhenAdminAlreadyExists() {
        when(roleRepository.findByCode("ADMIN")).thenReturn(Optional.of(adminRole));
        when(userRepository.existsByRoleCode("ADMIN")).thenReturn(true);

        runner("admin@example.com", "development-admin-password").run(null);

        verify(userRepository, never()).save(any(User.class));
        verify(passwordEncoder, never()).encode(any());
    }

    @Test
    void failsClearlyWhenAdminRoleIsMissing() {
        when(roleRepository.findByCode("ADMIN")).thenReturn(Optional.empty());

        IllegalStateException error = assertThrows(
            IllegalStateException.class,
            () -> runner("admin@example.com", "development-admin-password").run(null));

        assertEquals("Cannot bootstrap Admin: role ADMIN does not exist", error.getMessage());
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void failsClearlyWhenAdminPasswordIsMissing() {
        IllegalStateException error = assertThrows(
            IllegalStateException.class,
            () -> runner("admin@example.com", "").run(null));

        assertEquals("Cannot bootstrap Admin: ADMIN_PASSWORD is not configured", error.getMessage());
        verify(roleRepository, never()).findByCode(any());
    }

    private AdminBootstrapRunner runner(String email, String password) {
        return new AdminBootstrapRunner(
            userRepository,
            roleRepository,
            passwordEncoder,
            email,
            password);
    }
}

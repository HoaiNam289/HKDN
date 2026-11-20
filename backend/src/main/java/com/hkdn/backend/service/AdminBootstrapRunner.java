package com.hkdn.backend.service;

import com.hkdn.backend.entity.Role;
import com.hkdn.backend.entity.User;
import com.hkdn.backend.repository.RoleRepository;
import com.hkdn.backend.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Locale;

@Component
@Profile("dev")
@ConditionalOnProperty(
    prefix = "app.bootstrap-admin",
    name = "enabled",
    havingValue = "true"
)
public class AdminBootstrapRunner implements ApplicationRunner {

    private static final Logger log = LoggerFactory.getLogger(AdminBootstrapRunner.class);
    private static final String ADMIN_ROLE_CODE = "ADMIN";

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final String adminEmail;
    private final String adminPassword;

    public AdminBootstrapRunner(
            UserRepository userRepository,
            RoleRepository roleRepository,
            PasswordEncoder passwordEncoder,
            @Value("${app.bootstrap-admin.email:}")
            String adminEmail,
            @Value("${app.bootstrap-admin.password:}")
            String adminPassword) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.adminEmail = adminEmail;
        this.adminPassword = adminPassword;
    }

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        String normalizedEmail = validateAndNormalizeEmail(adminEmail);
        validatePassword(adminPassword);

        Role adminRole = roleRepository.findByCode(ADMIN_ROLE_CODE)
            .orElseThrow(() -> new IllegalStateException(
                "Cannot bootstrap Admin: role ADMIN does not exist"));

        if (userRepository.existsByRoleCode(ADMIN_ROLE_CODE)) {
            log.info("Admin bootstrap skipped: an ADMIN account already exists");
            return;
        }

        User admin = User.create(
            normalizedEmail,
            passwordEncoder.encode(adminPassword),
            normalizedEmail.substring(0, normalizedEmail.indexOf('@')));
        admin.getRoles().add(adminRole);
        userRepository.save(admin);

        log.info("Development Admin account bootstrapped for email {}", normalizedEmail);
    }

    private String validateAndNormalizeEmail(String email) {
        if (email == null || email.isBlank()) {
            throw new IllegalStateException(
                "Cannot bootstrap Admin: ADMIN_EMAIL is not configured");
        }

        String normalizedEmail = email.trim().toLowerCase(Locale.ROOT);
        if (!normalizedEmail.contains("@") || normalizedEmail.startsWith("@")
                || normalizedEmail.endsWith("@")) {
            throw new IllegalStateException(
                "Cannot bootstrap Admin: ADMIN_EMAIL is invalid");
        }
        return normalizedEmail;
    }

    private void validatePassword(String password) {
        if (password == null || password.isBlank()) {
            throw new IllegalStateException(
                "Cannot bootstrap Admin: ADMIN_PASSWORD is not configured");
        }
        if (password.length() < 12) {
            throw new IllegalStateException(
                "Cannot bootstrap Admin: ADMIN_PASSWORD must contain at least 12 characters");
        }
    }
}

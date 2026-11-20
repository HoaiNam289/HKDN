package com.hkdn.backend.dto;

import java.time.Instant;
import java.util.Set;
import java.util.UUID;

public record UserResponse(
    UUID id,
    String email,
    String fullName,
    boolean enabled,
    boolean locked,
    Instant createdAt,
    Instant updatedAt,
    Set<RoleResponse> roles
) {
}

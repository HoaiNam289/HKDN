package com.hkdn.backend.dto;

import com.hkdn.backend.entity.MaterialType;
import java.time.Instant;
import java.util.UUID;

public record MaterialTypeResponse(
        UUID id,
        String code,
        String name,
        String description,
        boolean active,
        Instant createdAt,
        Instant updatedAt
) {
    public static MaterialTypeResponse from(MaterialType t) {
        return new MaterialTypeResponse(
                t.getId(),
                t.getCode(),
                t.getName(),
                t.getDescription(),
                t.isActive(),
                t.getCreatedAt(),
                t.getUpdatedAt()
        );
    }
}

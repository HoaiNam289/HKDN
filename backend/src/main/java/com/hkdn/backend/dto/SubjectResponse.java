package com.hkdn.backend.dto;

import com.hkdn.backend.entity.Subject;
import java.time.Instant;
import java.util.UUID;

public record SubjectResponse(
        UUID id,
        String code,
        String name,
        String description,
        boolean active,
        Instant createdAt,
        Instant updatedAt
) {
    public static SubjectResponse from(Subject s) {
        return new SubjectResponse(
                s.getId(),
                s.getCode(),
                s.getName(),
                s.getDescription(),
                s.isActive(),
                s.getCreatedAt(),
                s.getUpdatedAt()
        );
    }
}

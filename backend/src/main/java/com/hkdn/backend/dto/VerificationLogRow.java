package com.hkdn.backend.dto;

import java.time.Instant;
import java.util.UUID;

/** Mot dong doc thang tu bang audit_logs (dung trong cau JPQL "select new ..."). */
public record VerificationLogRow(UUID id, String entityId, String details, String ipAddress, Instant createdAt) {
}

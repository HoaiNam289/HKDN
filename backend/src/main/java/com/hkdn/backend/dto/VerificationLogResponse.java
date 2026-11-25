package com.hkdn.backend.dto;

import java.time.Instant;
import java.util.UUID;

/**
 * Mot lan xac thuc chung chi.
 *
 * @param certificateCode ma chung chi da duoc xac thuc (null neu upload PDF khong khop chung chi nao)
 * @param method          cach xac thuc: CODE (nhap ma) hoac PDF (upload file)
 * @param result          ket qua: VALID, UNVERIFIED, REVOKED, PENDING, NOT_FOUND, INVALID
 */
public record VerificationLogResponse(
        UUID id,
        String certificateCode,
        String method,
        String result,
        String ipAddress,
        Instant verifiedAt) {
}

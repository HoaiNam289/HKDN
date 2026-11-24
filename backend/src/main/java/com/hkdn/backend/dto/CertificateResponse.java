package com.hkdn.backend.dto;

import com.hkdn.backend.entity.Certificate;
import com.hkdn.backend.entity.CertificateStatus;

import java.time.Instant;
import java.util.UUID;

public record CertificateResponse(
        UUID id,
        String code,
        String title,
        String description,
        String recipientName,
        String recipientEmail,
        String issuerName,
        UUID issuedById,
        CertificateStatus status,
        String contentHash,
        UUID signatureId,
        String blockchainTxHash,
        Instant issuedAt,
        Instant expiresAt,
        Instant revokedAt,
        String revocationReason,
        Instant createdAt,
        Instant updatedAt
) {
    public static CertificateResponse from(Certificate c) {
        return new CertificateResponse(
                c.getId(),
                c.getCode(),
                c.getTitle(),
                c.getDescription(),
                c.getRecipientName(),
                c.getRecipientEmail(),
                c.getIssuerName(),
                c.getIssuedBy() != null ? c.getIssuedBy().getId() : null,
                c.getStatus(),
                c.getContentHash(),
                c.getSignatureId(),
                c.getBlockchainTxHash(),
                c.getIssuedAt(),
                c.getExpiresAt(),
                c.getRevokedAt(),
                c.getRevocationReason(),
                c.getCreatedAt(),
                c.getUpdatedAt()
        );
    }
}
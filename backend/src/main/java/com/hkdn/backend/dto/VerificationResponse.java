package com.hkdn.backend.dto;
import java.time.Instant;
public record VerificationResponse(String status,boolean signatureValid,boolean hashValid,String code,String title,String recipientName,String issuerName,Instant issuedAt,Instant expiresAt,String message,String contentHash,String blockchainTxHash) {
    /** Ket qua khong gan voi chung chi nao (khong tim thay, file khong hop le...). */
    public static VerificationResponse withoutCertificate(String status, String message) {
        return new VerificationResponse(status, false, false, null, null, null, null, null, null, message, null, null);
    }
}

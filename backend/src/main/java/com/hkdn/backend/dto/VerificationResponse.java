package com.hkdn.backend.dto;
import java.time.Instant;
public record VerificationResponse(String status,boolean signatureValid,boolean hashValid,String code,String title,String recipientName,String issuerName,Instant issuedAt,Instant expiresAt,String message) {}

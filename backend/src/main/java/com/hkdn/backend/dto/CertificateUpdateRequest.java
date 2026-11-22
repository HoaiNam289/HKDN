package com.hkdn.backend.dto;
import jakarta.validation.constraints.*;
import java.time.Instant;
public record CertificateUpdateRequest(@NotBlank String title,String description,@NotBlank String recipientName,@Email String recipientEmail,@NotBlank String issuerName,Instant expiresAt) {}

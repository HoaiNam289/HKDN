package com.hkdn.backend.dto;
import jakarta.validation.constraints.*;
import java.time.Instant;
public record CertificateCreateRequest(@NotBlank @Size(max=80) String code,@NotBlank String title,String description,@NotBlank String recipientName,@Email String recipientEmail,@NotBlank String issuerName,Instant expiresAt) {}

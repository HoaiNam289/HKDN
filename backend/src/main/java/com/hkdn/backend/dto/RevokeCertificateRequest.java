package com.hkdn.backend.dto;
import jakarta.validation.constraints.NotBlank;
public record RevokeCertificateRequest(@NotBlank String reason) {}

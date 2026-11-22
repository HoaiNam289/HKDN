package com.hkdn.backend.dto;
import jakarta.validation.constraints.*;
public record ResetPasswordRequest(@NotBlank @Size(min=12,max=200) String newPassword) {}

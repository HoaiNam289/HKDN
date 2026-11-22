package com.hkdn.backend.dto;
import jakarta.validation.constraints.*;
import java.util.Set;
public record UserUpdateRequest(@NotBlank @Email @Size(max=255) String email, @NotBlank @Size(max=255) String fullName, Boolean enabled, Boolean locked, Set<@NotBlank String> roles) {}

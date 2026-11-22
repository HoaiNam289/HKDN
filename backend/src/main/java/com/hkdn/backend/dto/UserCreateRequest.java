package com.hkdn.backend.dto;
import jakarta.validation.constraints.*;
import java.util.Set;
public record UserCreateRequest(@NotBlank @Email String email,@NotBlank @Size(min=12,max=200) String password,@NotBlank @Size(max=255) String fullName,@NotEmpty Set<@NotBlank String> roles) {}

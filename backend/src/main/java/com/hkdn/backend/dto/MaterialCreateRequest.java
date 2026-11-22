package com.hkdn.backend.dto;
import jakarta.validation.constraints.*;
public record MaterialCreateRequest(@NotBlank String title,String description,@Size(max=120) String subject) {}

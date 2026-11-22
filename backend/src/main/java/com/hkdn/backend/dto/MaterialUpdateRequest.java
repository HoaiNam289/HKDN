package com.hkdn.backend.dto;
import jakarta.validation.constraints.*;
public record MaterialUpdateRequest(@NotBlank String title,String description,@Size(max=120) String subject) {}

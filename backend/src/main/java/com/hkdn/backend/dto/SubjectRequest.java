package com.hkdn.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record SubjectRequest(
        @NotBlank(message = "Mã môn học không được để trống")
        @Size(max = 50, message = "Mã môn học tối đa 50 ký tự")
        String code,

        @NotBlank(message = "Tên môn học không được để trống")
        @Size(max = 150, message = "Tên môn học tối đa 150 ký tự")
        String name,

        String description,
        Boolean active
) {}

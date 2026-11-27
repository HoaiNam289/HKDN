package com.hkdn.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record MaterialTypeRequest(
        @NotBlank(message = "Mã loại học liệu không được để trống")
        @Size(max = 50, message = "Mã loại học liệu tối đa 50 ký tự")
        String code,

        @NotBlank(message = "Tên loại học liệu không được để trống")
        @Size(max = 120, message = "Tên loại học liệu tối đa 120 ký tự")
        String name,

        String description,
        Boolean active
) {}

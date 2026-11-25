package com.hkdn.backend.dto;

import java.util.List;

/** Mot trang lich su xac thuc. */
public record VerificationLogPage(List<VerificationLogResponse> items, long total, int page, int size) {
}

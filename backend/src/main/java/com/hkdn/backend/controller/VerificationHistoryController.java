package com.hkdn.backend.controller;

import com.hkdn.backend.dto.VerificationLogPage;
import com.hkdn.backend.service.VerificationLogService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * Lich su xac thuc chung chi. Nam duoi /api/issuer/** nen SecurityConfig chi cho ADMIN va ISSUER
 * (Can bo dao tao) truy cap.
 */
@RestController
@RequestMapping("/api/issuer/verifications")
public class VerificationHistoryController {

    private final VerificationLogService verificationLogs;

    public VerificationHistoryController(VerificationLogService verificationLogs) {
        this.verificationLogs = verificationLogs;
    }

    @GetMapping
    public VerificationLogPage list(@RequestParam(defaultValue = "0") int page,
                                    @RequestParam(defaultValue = "20") int size) {
        return verificationLogs.list(page, size);
    }
}

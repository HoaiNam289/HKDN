package com.hkdn.backend.controller;

import com.hkdn.backend.dto.VerificationResponse;
import com.hkdn.backend.service.VerificationLogService;
import com.hkdn.backend.service.VerificationService;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

/** API xac thuc chung chi cong khai (khong can dang nhap). Moi lan xac thuc duoc ghi vao lich su. */
@RestController
@RequestMapping("/api/public/verify")
public class PublicVerificationController {

    private static final Logger log = LoggerFactory.getLogger(PublicVerificationController.class);

    private final VerificationService service;
    private final VerificationLogService verificationLogs;

    public PublicVerificationController(VerificationService service, VerificationLogService verificationLogs) {
        this.service = service;
        this.verificationLogs = verificationLogs;
    }

    @GetMapping("/certificates/{code}")
    public VerificationResponse certificate(@PathVariable String code, HttpServletRequest request) {
        VerificationResponse result = service.certificate(code);
        recordHistory(VerificationLogService.METHOD_CODE, code, result, request);
        return result;
    }

    @PostMapping(value = "/pdf", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public VerificationResponse pdf(@RequestPart("file") MultipartFile file, HttpServletRequest request) {
        VerificationResponse result = service.pdf(file);
        recordHistory(VerificationLogService.METHOD_PDF, null, result, request);
        return result;
    }

    /** Loi khi ghi lich su khong duoc lam hong ket qua xac thuc tra ve cho nguoi dung. */
    private void recordHistory(String method, String code, VerificationResponse result, HttpServletRequest request) {
        try {
            verificationLogs.record(method, code, result, request.getRemoteAddr());
        } catch (RuntimeException exception) {
            log.warn("Could not record verification history for code {}", code, exception);
        }
    }
}

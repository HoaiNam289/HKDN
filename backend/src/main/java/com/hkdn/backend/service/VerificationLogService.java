package com.hkdn.backend.service;

import com.hkdn.backend.dto.VerificationLogPage;
import com.hkdn.backend.dto.VerificationLogResponse;
import com.hkdn.backend.dto.VerificationLogRow;
import com.hkdn.backend.dto.VerificationResponse;
import com.hkdn.backend.entity.AuditLog;
import com.hkdn.backend.repository.AuditLogRepository;
import com.hkdn.backend.repository.VerificationLogRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** Ghi va doc lich su xac thuc chung chi (luu trong bang audit_logs). */
@Service
public class VerificationLogService {

    public static final String ACTION = "CERTIFICATE_VERIFIED";
    public static final String ENTITY_TYPE = "CERTIFICATE";
    public static final String METHOD_CODE = "CODE";
    public static final String METHOD_PDF = "PDF";

    private static final int MAX_PAGE_SIZE = 100;

    private final AuditLogRepository auditLogs;
    private final VerificationLogRepository history;

    public VerificationLogService(AuditLogRepository auditLogs, VerificationLogRepository history) {
        this.auditLogs = auditLogs;
        this.history = history;
    }

    /**
     * Ghi lai mot lan xac thuc. Nguoi xac thuc la khach (khong dang nhap) nen actor de trong.
     *
     * @param method        METHOD_CODE hoac METHOD_PDF
     * @param submittedCode ma nguoi dung nhap (dung khi khong tim thay chung chi)
     */
    @Transactional
    public void record(String method, String submittedCode, VerificationResponse result, String ipAddress) {
        AuditLog entry = new AuditLog();
        entry.setAction(ACTION);
        entry.setEntityType(ENTITY_TYPE);
        entry.setEntityId(truncate(result.code() != null ? result.code() : submittedCode, 100));
        entry.setDetails("method=" + method + ";status=" + result.status());
        entry.setIpAddress(truncate(ipAddress, 64));
        auditLogs.save(entry);
    }

    /** Lay lich su xac thuc, moi nhat truoc. */
    @Transactional(readOnly = true)
    public VerificationLogPage list(int page, int size) {
        int safePage = Math.max(page, 0);
        int safeSize = Math.min(Math.max(size, 1), MAX_PAGE_SIZE);
        Page<VerificationLogRow> rows = history.findByAction(ACTION, PageRequest.of(safePage, safeSize));
        return new VerificationLogPage(
                rows.map(this::toResponse).getContent(),
                rows.getTotalElements(),
                safePage,
                safeSize);
    }

    private VerificationLogResponse toResponse(VerificationLogRow row) {
        return new VerificationLogResponse(
                row.id(),
                row.entityId(),
                detail(row.details(), "method"),
                detail(row.details(), "status"),
                row.ipAddress(),
                row.createdAt());
    }

    /** Doc gia tri trong chuoi dang "method=CODE;status=VALID". */
    private static String detail(String details, String key) {
        if (details == null) {
            return null;
        }
        for (String part : details.split(";")) {
            String[] pair = part.split("=", 2);
            if (pair.length == 2 && pair[0].trim().equals(key)) {
                return pair[1].trim();
            }
        }
        return null;
    }

    private static String truncate(String value, int max) {
        if (value == null) {
            return null;
        }
        String trimmed = value.trim();
        return trimmed.length() <= max ? trimmed : trimmed.substring(0, max);
    }
}

package com.hkdn.backend.repository;

import com.hkdn.backend.dto.VerificationLogRow;
import com.hkdn.backend.entity.AuditLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;
import org.springframework.data.repository.query.Param;

import java.util.UUID;

/** Doc lich su xac thuc chung chi tu bang audit_logs (chi doc, ghi dung AuditLogRepository). */
public interface VerificationLogRepository extends Repository<AuditLog, UUID> {

    @Query(value = """
            select new com.hkdn.backend.dto.VerificationLogRow(a.id, a.entityId, a.details, a.ipAddress, a.createdAt)
            from AuditLog a
            where a.action = :action
            order by a.createdAt desc
            """,
            countQuery = "select count(a) from AuditLog a where a.action = :action")
    Page<VerificationLogRow> findByAction(@Param("action") String action, Pageable pageable);
}

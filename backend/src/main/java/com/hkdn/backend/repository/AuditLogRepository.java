package com.hkdn.backend.repository;
import com.hkdn.backend.entity.AuditLog;import org.springframework.data.jpa.repository.JpaRepository;import java.util.UUID;
public interface AuditLogRepository extends JpaRepository<AuditLog,UUID> {}

package com.hkdn.backend.repository;
import com.hkdn.backend.entity.Certificate;
import com.hkdn.backend.entity.CertificateStatus;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;
public interface CertificateRepository extends JpaRepository<Certificate, UUID> {
    Optional<Certificate> findByCodeIgnoreCase(String code);
    Optional<Certificate> findByContentHashIgnoreCase(String contentHash);
    Page<Certificate> findByTitleContainingIgnoreCaseOrCodeContainingIgnoreCase(String title, String code, Pageable pageable);
    Page<Certificate> findByStatus(CertificateStatus status, Pageable pageable);
}

package com.hkdn.backend.repository;

import com.hkdn.backend.entity.Certificate;
import com.hkdn.backend.entity.CertificateStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface CertificateRepository extends JpaRepository<Certificate, UUID> {
    Optional<Certificate> findByCodeIgnoreCase(String code);
    Optional<Certificate> findByContentHashIgnoreCase(String contentHash);
    Page<Certificate> findByTitleContainingIgnoreCaseOrCodeContainingIgnoreCase(String title, String code, Pageable pageable);
    Page<Certificate> findByStatus(CertificateStatus status, Pageable pageable);
    Page<Certificate> findByRecipientEmailIgnoreCase(String recipientEmail, Pageable pageable);
}
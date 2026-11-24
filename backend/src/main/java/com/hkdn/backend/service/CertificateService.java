package com.hkdn.backend.service;

import com.hkdn.backend.dto.CertificateCreateRequest;
import com.hkdn.backend.dto.CertificateUpdateRequest;
import com.hkdn.backend.dto.RevokeCertificateRequest;
import com.hkdn.backend.entity.BlockchainStatus;
import com.hkdn.backend.entity.BlockchainTransaction;
import com.hkdn.backend.entity.Certificate;
import com.hkdn.backend.entity.CertificateStatus;
import com.hkdn.backend.entity.DigitalSignature;
import com.hkdn.backend.exception.BusinessException;
import com.hkdn.backend.exception.ConflictException;
import com.hkdn.backend.exception.ResourceNotFoundException;
import com.hkdn.backend.repository.CertificateRepository;
import com.hkdn.backend.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

@Service
public class CertificateService {
    private final CertificateRepository certificates;
    private final UserRepository users;
    private final HashService hashes;
    private final CertificateDocumentService documents;
    private final DigitalSignatureService signatures;
    private final BlockchainService blockchain;
    private final AuditService audit;

    public CertificateService(CertificateRepository certificates, UserRepository users, HashService hashes,
                              CertificateDocumentService documents, DigitalSignatureService signatures,
                              BlockchainService blockchain, AuditService audit) {
        this.certificates = certificates;
        this.users = users;
        this.hashes = hashes;
        this.documents = documents;
        this.signatures = signatures;
        this.blockchain = blockchain;
        this.audit = audit;
    }

    @Transactional
    public Certificate create(CertificateCreateRequest request, UUID actor) {
        String code = request.code().trim();
        if (certificates.findByCodeIgnoreCase(code).isPresent()) {
            throw new ConflictException("Certificate code already exists");
        }
        Certificate certificate = new Certificate();
        certificate.setCode(code);
        certificate.setTitle(request.title().trim());
        certificate.setDescription(request.description());
        certificate.setRecipientName(request.recipientName().trim());
        certificate.setRecipientEmail(request.recipientEmail());
        certificate.setIssuerName(request.issuerName().trim());
        certificate.setExpiresAt(request.expiresAt());
        certificate.setIssuedBy(users.findWithRolesById(actor)
                .orElseThrow(() -> new ResourceNotFoundException("Issuer not found")));
        return certificates.save(certificate);
    }

    @Transactional(readOnly = true)
    public Page<Certificate> list(String query, CertificateStatus status, Pageable pageable) {
        if (status != null) return certificates.findByStatus(status, pageable);
        String normalized = query == null ? "" : query.trim();
        return certificates.findByTitleContainingIgnoreCaseOrCodeContainingIgnoreCase(normalized, normalized, pageable);
    }

    @Transactional(readOnly = true)
    public Certificate get(UUID id) { return find(id); }

    @Transactional
    public Certificate update(UUID id, CertificateUpdateRequest request) {
        Certificate certificate = find(id);
        if (certificate.getStatus() != CertificateStatus.DRAFT) {
            throw new BusinessException("Only draft certificates can be edited");
        }
        certificate.setTitle(request.title().trim());
        certificate.setDescription(request.description());
        certificate.setRecipientName(request.recipientName().trim());
        certificate.setRecipientEmail(request.recipientEmail());
        certificate.setIssuerName(request.issuerName().trim());
        certificate.setExpiresAt(request.expiresAt());
        return certificate;
    }

    @Transactional
    public Certificate issue(UUID id, UUID actor) {
        Certificate certificate = find(id);
        if (certificate.getStatus() != CertificateStatus.DRAFT) {
            throw new BusinessException("Only draft certificates can be issued");
        }
        String hash = hashes.sha256(documents.pdf(certificate));
        Optional<DigitalSignature> signature = signatures.sign(hash, actor);
        if (signature.isEmpty()) throw new BusinessException("Digital signing keys are not configured");
        certificate.setContentHash(hash);
        certificate.setSignatureId(signature.get().getId());
        certificate.setIssuedAt(Instant.now());
        certificate.setStatus(CertificateStatus.PENDING_BLOCKCHAIN);
        Certificate saved = certificates.save(certificate);
        BlockchainTransaction transaction = blockchain.record(saved);
        if (transaction.getStatus() == BlockchainStatus.CONFIRMED) {
            saved.setBlockchainTxHash(transaction.getTransactionHash());
            saved.setStatus(CertificateStatus.ISSUED);
        }
        audit.record(actor, "CERTIFICATE_ISSUED", "CERTIFICATE", saved.getId().toString(), saved.getStatus().name());
        return saved;
    }

    @Transactional
    public Certificate revoke(UUID id, RevokeCertificateRequest request) {
        Certificate certificate = find(id);
        if (certificate.getStatus() != CertificateStatus.ISSUED) {
            throw new BusinessException("Only issued certificates can be revoked");
        }
        String reason = request.reason().trim();
        certificate.setStatus(CertificateStatus.REVOKED);
        certificate.setRevokedAt(Instant.now());
        certificate.setRevocationReason(reason);
        audit.record(null, "CERTIFICATE_REVOKED", "CERTIFICATE", id.toString(), reason);
        return certificate;
    }

    public Certificate find(UUID id) {
        return certificates.findById(id).orElseThrow(() -> new ResourceNotFoundException("Certificate not found"));
    }

    @Transactional(readOnly = true)
    public Page<Certificate> myCertificates(String recipientEmail, Pageable pageable) {
        if (recipientEmail == null || recipientEmail.isBlank()) {
            return Page.empty(pageable);
        }
        return certificates.findByRecipientEmailIgnoreCase(recipientEmail.trim(), pageable);
    }

    @Transactional(readOnly = true)
    public Certificate getByCode(String code) {
        return certificates.findByCodeIgnoreCase(code.trim())
                .orElseThrow(() -> new ResourceNotFoundException("Certificate not found"));
    }
}

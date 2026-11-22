package com.hkdn.backend.service;

import com.hkdn.backend.dto.VerificationResponse;
import com.hkdn.backend.entity.Certificate;
import com.hkdn.backend.entity.CertificateStatus;
import com.hkdn.backend.entity.DigitalSignature;
import com.hkdn.backend.repository.CertificateRepository;
import com.hkdn.backend.repository.DigitalSignatureRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.Optional;

@Service
public class VerificationService {
    private final CertificateRepository certificates;
    private final DigitalSignatureRepository signatures;
    private final HashService hashes;
    private final CertificateDocumentService documents;
    private final DigitalSignatureService signatureService;

    public VerificationService(CertificateRepository certificates, DigitalSignatureRepository signatures,
                                HashService hashes, CertificateDocumentService documents,
                                DigitalSignatureService signatureService) {
        this.certificates = certificates;
        this.signatures = signatures;
        this.hashes = hashes;
        this.documents = documents;
        this.signatureService = signatureService;
    }

    @Transactional(readOnly = true)
    public VerificationResponse certificate(String code) {
        Optional<Certificate> found = certificates.findByCodeIgnoreCase(code);
        if (found.isEmpty()) {
            return new VerificationResponse("NOT_FOUND", false, false, null, null, null, null, null, null,
                    "Certificate was not found");
        }
        Certificate certificate = found.get();
        if (certificate.getStatus() == CertificateStatus.REVOKED) {
            return response(certificate, "REVOKED", false, false, "Certificate has been revoked");
        }
        if (certificate.getStatus() != CertificateStatus.ISSUED) {
            return response(certificate, "PENDING", false, false, "Certificate is not issued yet");
        }
        String hash = hashes.sha256(documents.pdf(certificate));
        boolean hashValid = hash.equalsIgnoreCase(certificate.getContentHash());
        DigitalSignature signature = certificate.getSignatureId() == null ? null
                : signatures.findById(certificate.getSignatureId()).orElse(null);
        boolean signatureValid = signatureService.verify(signature, hash);
        return response(certificate, hashValid && signatureValid ? "VALID" : "UNVERIFIED",
                signatureValid, hashValid,
                hashValid && signatureValid ? "Certificate is valid"
                        : "Certificate evidence could not be fully verified");
    }

    @Transactional(readOnly = true)
    public VerificationResponse pdf(MultipartFile file) {
        try {
            if (file == null || file.isEmpty()) {
                return new VerificationResponse("INVALID", false, false, null, null, null, null, null, null,
                        "A PDF file is required");
            }
            String hash = hashes.sha256(file.getBytes());
            return certificates.findByContentHashIgnoreCase(hash)
                    .map(certificate -> certificate(certificate.getCode()))
                    .orElse(new VerificationResponse("NOT_FOUND", false, false, null, null, null, null, null, null,
                            "No certificate matches this document hash"));
        } catch (Exception exception) {
            return new VerificationResponse("INVALID", false, false, null, null, null, null, null, null,
                    "Unable to verify document");
        }
    }

    private VerificationResponse response(Certificate certificate, String status, boolean signatureValid,
                                          boolean hashValid, String message) {
        return new VerificationResponse(status, signatureValid, hashValid, certificate.getCode(),
                certificate.getTitle(), certificate.getRecipientName(), certificate.getIssuerName(),
                certificate.getIssuedAt(), certificate.getExpiresAt(), message);
    }
}

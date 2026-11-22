package com.hkdn.backend.entity;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity @Table(name = "certificates")
public class Certificate {
    @Id @GeneratedValue(strategy = GenerationType.UUID) private UUID id;
    @Column(nullable=false, unique=true, length=80) private String code;
    @Column(nullable=false) private String title;
    @Column(columnDefinition="text") private String description;
    @Column(name="recipient_name", nullable=false) private String recipientName;
    @Column(name="recipient_email") private String recipientEmail;
    @Column(name="issuer_name", nullable=false) private String issuerName;
    @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="issued_by") private User issuedBy;
    @Enumerated(EnumType.STRING) @Column(nullable=false, length=32) private CertificateStatus status=CertificateStatus.DRAFT;
    @Column(name="content_hash", length=128) private String contentHash;
    @Column(name="signature_id") private UUID signatureId;
    @Column(name="blockchain_tx_hash", length=128) private String blockchainTxHash;
    @Column(name="issued_at") private Instant issuedAt;
    @Column(name="expires_at") private Instant expiresAt;
    @Column(name="revoked_at") private Instant revokedAt;
    @Column(name="revocation_reason", length=500) private String revocationReason;
    @Column(name="created_at", nullable=false, updatable=false) private Instant createdAt;
    @Column(name="updated_at", nullable=false) private Instant updatedAt;
    @PrePersist void prePersist(){ createdAt=Instant.now(); updatedAt=createdAt; }
    @PreUpdate void preUpdate(){ updatedAt=Instant.now(); }
    public UUID getId(){return id;} public String getCode(){return code;} public void setCode(String v){code=v;}
    public String getTitle(){return title;} public void setTitle(String v){title=v;} public String getDescription(){return description;} public void setDescription(String v){description=v;}
    public String getRecipientName(){return recipientName;} public void setRecipientName(String v){recipientName=v;} public String getRecipientEmail(){return recipientEmail;} public void setRecipientEmail(String v){recipientEmail=v;}
    public String getIssuerName(){return issuerName;} public void setIssuerName(String v){issuerName=v;} public User getIssuedBy(){return issuedBy;} public void setIssuedBy(User v){issuedBy=v;}
    public CertificateStatus getStatus(){return status;} public void setStatus(CertificateStatus v){status=v;} public String getContentHash(){return contentHash;} public void setContentHash(String v){contentHash=v;}
    public UUID getSignatureId(){return signatureId;} public void setSignatureId(UUID v){signatureId=v;} public String getBlockchainTxHash(){return blockchainTxHash;} public void setBlockchainTxHash(String v){blockchainTxHash=v;}
    public Instant getIssuedAt(){return issuedAt;} public void setIssuedAt(Instant v){issuedAt=v;} public Instant getExpiresAt(){return expiresAt;} public void setExpiresAt(Instant v){expiresAt=v;}
    public Instant getRevokedAt(){return revokedAt;} public void setRevokedAt(Instant v){revokedAt=v;} public String getRevocationReason(){return revocationReason;} public void setRevocationReason(String v){revocationReason=v;}
    public Instant getCreatedAt(){return createdAt;} public Instant getUpdatedAt(){return updatedAt;}
}

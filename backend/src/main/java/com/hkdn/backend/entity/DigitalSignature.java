package com.hkdn.backend.entity;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity @Table(name="digital_signatures")
public class DigitalSignature {
    @Id @GeneratedValue(strategy=GenerationType.UUID) private UUID id;
    @Column(nullable=false) private String algorithm;
    @Column(name="key_id", nullable=false) private String keyId;
    @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="signer_id", nullable=false) private User signer;
    @Column(name="content_hash", nullable=false, length=128) private String contentHash;
    @Column(name="signature_value", nullable=false, columnDefinition="text") private String signatureValue;
    @Column(name="public_key", nullable=false, columnDefinition="text") private String publicKey;
    @Column(name="signed_at", nullable=false) private Instant signedAt;
    @Column(nullable=false) private boolean valid=true;
    @PrePersist void prePersist(){signedAt=Instant.now();}
    public UUID getId(){return id;} public String getAlgorithm(){return algorithm;} public void setAlgorithm(String v){algorithm=v;} public String getKeyId(){return keyId;} public void setKeyId(String v){keyId=v;} public User getSigner(){return signer;} public void setSigner(User v){signer=v;} public String getContentHash(){return contentHash;} public void setContentHash(String v){contentHash=v;} public String getSignatureValue(){return signatureValue;} public void setSignatureValue(String v){signatureValue=v;} public String getPublicKey(){return publicKey;} public void setPublicKey(String v){publicKey=v;} public Instant getSignedAt(){return signedAt;} public boolean isValid(){return valid;} public void setValid(boolean v){valid=v;}
}

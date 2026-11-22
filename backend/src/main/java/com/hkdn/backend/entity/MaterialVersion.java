package com.hkdn.backend.entity;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity @Table(name="material_versions", uniqueConstraints=@UniqueConstraint(columnNames={"material_id","version_number"}))
public class MaterialVersion {
    @Id @GeneratedValue(strategy=GenerationType.UUID) private UUID id;
    @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="material_id", nullable=false) private Material material;
    @Column(name="version_number", nullable=false) private int versionNumber;
    @Column(name="original_filename", nullable=false) private String originalFilename;
    @Column(name="storage_key", nullable=false, unique=true) private String storageKey;
    @Column(name="content_type", nullable=false) private String contentType;
    @Column(name="file_size", nullable=false) private long fileSize;
    @Column(name="content_hash", nullable=false, length=128) private String contentHash;
    @Column(name="signature_id") private UUID signatureId;
    @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="uploaded_by", nullable=false) private User uploadedBy;
    @Column(name="created_at", nullable=false, updatable=false) private Instant createdAt;
    @PrePersist void prePersist(){createdAt=Instant.now();}
    public UUID getId(){return id;} public Material getMaterial(){return material;} public void setMaterial(Material v){material=v;} public int getVersionNumber(){return versionNumber;} public void setVersionNumber(int v){versionNumber=v;} public String getOriginalFilename(){return originalFilename;} public void setOriginalFilename(String v){originalFilename=v;} public String getStorageKey(){return storageKey;} public void setStorageKey(String v){storageKey=v;} public String getContentType(){return contentType;} public void setContentType(String v){contentType=v;} public long getFileSize(){return fileSize;} public void setFileSize(long v){fileSize=v;} public String getContentHash(){return contentHash;} public void setContentHash(String v){contentHash=v;} public UUID getSignatureId(){return signatureId;} public void setSignatureId(UUID v){signatureId=v;} public User getUploadedBy(){return uploadedBy;} public void setUploadedBy(User v){uploadedBy=v;} public Instant getCreatedAt(){return createdAt;}
}

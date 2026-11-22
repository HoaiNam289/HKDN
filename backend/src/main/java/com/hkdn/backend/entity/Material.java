package com.hkdn.backend.entity;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity @Table(name="materials")
public class Material {
    @Id @GeneratedValue(strategy=GenerationType.UUID) private UUID id;
    @Column(nullable=false) private String title;
    @Column(columnDefinition="text") private String description;
    private String subject;
    @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="owner_id", nullable=false) private User owner;
    @Enumerated(EnumType.STRING) @Column(nullable=false, length=32) private MaterialStatus status=MaterialStatus.ACTIVE;
    @Column(name="current_version", nullable=false) private int currentVersion=1;
    @Column(name="created_at", nullable=false, updatable=false) private Instant createdAt;
    @Column(name="updated_at", nullable=false) private Instant updatedAt;
    @Column(name="archived_at") private Instant archivedAt;
    @PrePersist void prePersist(){createdAt=Instant.now();updatedAt=createdAt;} @PreUpdate void preUpdate(){updatedAt=Instant.now();}
    public UUID getId(){return id;} public String getTitle(){return title;} public void setTitle(String v){title=v;} public String getDescription(){return description;} public void setDescription(String v){description=v;} public String getSubject(){return subject;} public void setSubject(String v){subject=v;} public User getOwner(){return owner;} public void setOwner(User v){owner=v;} public MaterialStatus getStatus(){return status;} public void setStatus(MaterialStatus v){status=v;} public int getCurrentVersion(){return currentVersion;} public void setCurrentVersion(int v){currentVersion=v;} public Instant getCreatedAt(){return createdAt;} public Instant getUpdatedAt(){return updatedAt;} public Instant getArchivedAt(){return archivedAt;} public void setArchivedAt(Instant v){archivedAt=v;}
}

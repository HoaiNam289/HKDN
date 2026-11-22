package com.hkdn.backend.entity;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity @Table(name="blockchain_transactions")
public class BlockchainTransaction {
    @Id @GeneratedValue(strategy=GenerationType.UUID) private UUID id;
    @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="certificate_id") private Certificate certificate;
    @Column(name="content_hash", nullable=false) private String contentHash;
    @Column(nullable=false) private String network;
    @Column(name="contract_address") private String contractAddress;
    @Column(name="transaction_hash") private String transactionHash;
    @Enumerated(EnumType.STRING) @Column(nullable=false) private BlockchainStatus status;
    @Column(name="error_message") private String errorMessage;
    @Column(name="created_at", nullable=false, updatable=false) private Instant createdAt;
    @Column(name="confirmed_at") private Instant confirmedAt;
    @PrePersist void prePersist(){createdAt=Instant.now();}
    public UUID getId(){return id;} public Certificate getCertificate(){return certificate;} public void setCertificate(Certificate v){certificate=v;} public String getContentHash(){return contentHash;} public void setContentHash(String v){contentHash=v;} public String getNetwork(){return network;} public void setNetwork(String v){network=v;} public String getContractAddress(){return contractAddress;} public void setContractAddress(String v){contractAddress=v;} public String getTransactionHash(){return transactionHash;} public void setTransactionHash(String v){transactionHash=v;} public BlockchainStatus getStatus(){return status;} public void setStatus(BlockchainStatus v){status=v;} public String getErrorMessage(){return errorMessage;} public void setErrorMessage(String v){errorMessage=v;} public Instant getCreatedAt(){return createdAt;} public Instant getConfirmedAt(){return confirmedAt;} public void setConfirmedAt(Instant v){confirmedAt=v;}
}

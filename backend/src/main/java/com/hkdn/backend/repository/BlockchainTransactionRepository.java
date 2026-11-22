package com.hkdn.backend.repository;
import com.hkdn.backend.entity.BlockchainTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;
public interface BlockchainTransactionRepository extends JpaRepository<BlockchainTransaction, UUID> { Optional<BlockchainTransaction> findFirstByContentHashOrderByCreatedAtDesc(String hash); }

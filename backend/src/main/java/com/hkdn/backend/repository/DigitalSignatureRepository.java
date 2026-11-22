package com.hkdn.backend.repository;
import com.hkdn.backend.entity.DigitalSignature;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;
public interface DigitalSignatureRepository extends JpaRepository<DigitalSignature, UUID> { Optional<DigitalSignature> findFirstByContentHashAndValidTrueOrderBySignedAtDesc(String hash); }

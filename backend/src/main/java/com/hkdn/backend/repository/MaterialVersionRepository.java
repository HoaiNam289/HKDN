package com.hkdn.backend.repository;
import com.hkdn.backend.entity.MaterialVersion;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;
public interface MaterialVersionRepository extends JpaRepository<MaterialVersion, UUID> { List<MaterialVersion> findByMaterialIdOrderByVersionNumberDesc(UUID materialId); Optional<MaterialVersion> findByStorageKey(String storageKey); }

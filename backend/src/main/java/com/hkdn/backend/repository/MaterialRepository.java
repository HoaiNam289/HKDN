package com.hkdn.backend.repository;
import com.hkdn.backend.entity.Material;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;
public interface MaterialRepository extends JpaRepository<Material, UUID> { Page<Material> findByTitleContainingIgnoreCaseOrSubjectContainingIgnoreCase(String title,String subject,Pageable pageable); }

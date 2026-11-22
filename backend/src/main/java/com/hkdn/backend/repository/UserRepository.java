package com.hkdn.backend.repository;

import com.hkdn.backend.entity.User;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface UserRepository extends JpaRepository<User, UUID> {

    Optional<User> findByEmailIgnoreCase(String email);

    boolean existsByEmailIgnoreCase(String email);

    @Query("select count(u) > 0 from User u join u.roles r where r.code = :roleCode")
    boolean existsByRoleCode(@Param("roleCode") String roleCode);

    @Query("select count(distinct u) from User u join u.roles r where r.code = :roleCode")
    long countByRoleCode(@Param("roleCode") String roleCode);

    @EntityGraph(attributePaths = "roles")
    Optional<User> findWithRolesByEmailIgnoreCase(String email);

    @EntityGraph(attributePaths = "roles")
    Optional<User> findWithRolesById(UUID id);

    @Query("select distinct u from User u left join fetch u.roles where lower(u.email) = lower(:email)")
    Optional<User> findByEmailWithRoles(@Param("email") String email);

    @EntityGraph(attributePaths = "roles")
    Page<User> findByEmailContainingIgnoreCaseOrFullNameContainingIgnoreCase(String email, String fullName, Pageable pageable);

    @EntityGraph(attributePaths = "roles")
    @Query("select distinct u from User u left join u.roles r where (lower(u.email) like lower(concat('%', :q, '%')) or lower(u.fullName) like lower(concat('%', :q, '%'))) and (:role is null or r.code = :role) and (:status is null or (:status = 'ACTIVE' and u.enabled = true and u.locked = false) or (:status = 'INACTIVE' and (u.enabled = false or u.locked = true)))")
    Page<User> searchAdminUsers(@Param("q") String query, @Param("role") String role, @Param("status") String status, Pageable pageable);
}

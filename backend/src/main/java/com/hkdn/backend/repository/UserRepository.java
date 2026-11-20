package com.hkdn.backend.repository;

import com.hkdn.backend.entity.User;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {

    Optional<User> findByEmailIgnoreCase(String email);

    boolean existsByEmailIgnoreCase(String email);

    @Query("select count(u) > 0 from User u join u.roles r where r.code = :roleCode")
    boolean existsByRoleCode(@Param("roleCode") String roleCode);

    @EntityGraph(attributePaths = "roles")
    Optional<User> findWithRolesByEmailIgnoreCase(String email);

    @EntityGraph(attributePaths = "roles")
    Optional<User> findWithRolesById(UUID id);

    @Query("select distinct u from User u left join fetch u.roles where lower(u.email) = lower(:email)")
    Optional<User> findByEmailWithRoles(@Param("email") String email);
}

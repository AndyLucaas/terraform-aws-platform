package com.itdesk.platform.repository;

import com.itdesk.platform.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, Long>, JpaSpecificationExecutor<User> {

    Optional<User> findByKeycloakId(UUID keycloakId);

    Optional<User> findByUsername(String username);

    Optional<User> findByEmailIgnoreCase(String email);

    boolean existsByUsernameIgnoreCase(String username);

    boolean existsByEmailIgnoreCase(String email);

    @Query("""
            select u from User u
            where u.available = true
              and u.status = com.itdesk.platform.entity.enums.UserStatus.ACTIVE
              and exists (select 1 from u.roles r where r.code = 'TECHNICIAN')
            """)
    Page<User> findAvailableTechnicians(Pageable pageable);

    @Query("""
            select count(u) from User u
            where u.available = true
              and u.status = com.itdesk.platform.entity.enums.UserStatus.ACTIVE
              and exists (select 1 from u.roles r where r.code = 'TECHNICIAN')
            """)
    long countAvailableTechnicians();
}

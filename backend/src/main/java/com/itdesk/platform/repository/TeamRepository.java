package com.itdesk.platform.repository;

import com.itdesk.platform.entity.Team;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TeamRepository extends JpaRepository<Team, Long> {

    List<Team> findByDepartmentId(Long departmentId);

    boolean existsByNameIgnoreCaseAndDepartmentId(String name, Long departmentId);
}

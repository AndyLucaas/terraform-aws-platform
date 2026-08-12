package com.itdesk.platform.service;

import com.itdesk.platform.dto.organization.TeamRequest;
import com.itdesk.platform.dto.organization.TeamResponse;
import com.itdesk.platform.entity.Department;
import com.itdesk.platform.entity.Team;
import com.itdesk.platform.exception.DuplicateResourceException;
import com.itdesk.platform.exception.ResourceNotFoundException;
import com.itdesk.platform.mapper.TeamMapper;
import com.itdesk.platform.repository.DepartmentRepository;
import com.itdesk.platform.repository.TeamRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TeamService {

    private final TeamRepository teamRepository;
    private final DepartmentRepository departmentRepository;
    private final TeamMapper teamMapper;

    public List<TeamResponse> findAll() {
        return teamRepository.findAll().stream().map(teamMapper::toResponse).toList();
    }

    public List<TeamResponse> findByDepartment(Long departmentId) {
        return teamRepository.findByDepartmentId(departmentId).stream().map(teamMapper::toResponse).toList();
    }

    @Transactional
    public TeamResponse create(TeamRequest request) {
        Department department = departmentRepository.findById(request.departmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Département introuvable : " + request.departmentId()));

        if (teamRepository.existsByNameIgnoreCaseAndDepartmentId(request.name(), request.departmentId())) {
            throw new DuplicateResourceException("Une équipe nommée '" + request.name() + "' existe déjà dans ce département");
        }

        Team team = Team.builder()
                .name(request.name())
                .description(request.description())
                .department(department)
                .build();
        return teamMapper.toResponse(teamRepository.save(team));
    }

    @Transactional
    public TeamResponse update(Long id, TeamRequest request) {
        Team team = teamRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Équipe introuvable : " + id));
        Department department = departmentRepository.findById(request.departmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Département introuvable : " + request.departmentId()));

        team.setName(request.name());
        team.setDescription(request.description());
        team.setDepartment(department);
        return teamMapper.toResponse(team);
    }

    @Transactional
    public void delete(Long id) {
        if (!teamRepository.existsById(id)) {
            throw new ResourceNotFoundException("Équipe introuvable : " + id);
        }
        teamRepository.deleteById(id);
    }
}

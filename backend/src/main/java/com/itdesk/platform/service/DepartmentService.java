package com.itdesk.platform.service;

import com.itdesk.platform.dto.organization.DepartmentRequest;
import com.itdesk.platform.dto.organization.DepartmentResponse;
import com.itdesk.platform.entity.Department;
import com.itdesk.platform.exception.DuplicateResourceException;
import com.itdesk.platform.exception.ResourceNotFoundException;
import com.itdesk.platform.mapper.DepartmentMapper;
import com.itdesk.platform.repository.DepartmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DepartmentService {

    private final DepartmentRepository departmentRepository;
    private final DepartmentMapper departmentMapper;

    public List<DepartmentResponse> findAll() {
        return departmentRepository.findAll().stream()
                .map(departmentMapper::toResponse)
                .toList();
    }

    public DepartmentResponse findById(Long id) {
        return departmentMapper.toResponse(getOrThrow(id));
    }

    @Transactional
    public DepartmentResponse create(DepartmentRequest request) {
        if (departmentRepository.existsByNameIgnoreCase(request.name())) {
            throw new DuplicateResourceException("Un département nommé '" + request.name() + "' existe déjà");
        }
        Department department = Department.builder()
                .name(request.name())
                .description(request.description())
                .build();
        return departmentMapper.toResponse(departmentRepository.save(department));
    }

    @Transactional
    public DepartmentResponse update(Long id, DepartmentRequest request) {
        Department department = getOrThrow(id);
        department.setName(request.name());
        department.setDescription(request.description());
        return departmentMapper.toResponse(department);
    }

    @Transactional
    public void delete(Long id) {
        Department department = getOrThrow(id);
        departmentRepository.delete(department);
    }

    private Department getOrThrow(Long id) {
        return departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Département introuvable : " + id));
    }
}

package com.itdesk.platform.mapper;

import com.itdesk.platform.dto.organization.DepartmentResponse;
import com.itdesk.platform.entity.Department;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface DepartmentMapper {

    @Mapping(target = "teamCount", expression = "java(department.getTeams().size())")
    DepartmentResponse toResponse(Department department);
}

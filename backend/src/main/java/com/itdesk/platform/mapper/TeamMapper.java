package com.itdesk.platform.mapper;

import com.itdesk.platform.dto.organization.TeamResponse;
import com.itdesk.platform.entity.Team;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface TeamMapper {

    @Mapping(target = "departmentId", source = "department.id")
    @Mapping(target = "departmentName", source = "department.name")
    TeamResponse toResponse(Team team);
}

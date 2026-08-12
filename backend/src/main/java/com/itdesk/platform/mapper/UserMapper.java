package com.itdesk.platform.mapper;

import com.itdesk.platform.dto.user.UserResponse;
import com.itdesk.platform.dto.user.UserSummaryResponse;
import com.itdesk.platform.entity.Role;
import com.itdesk.platform.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.Set;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface UserMapper {

    @Mapping(target = "fullName", expression = "java(user.getFirstName() + \" \" + user.getLastName())")
    UserSummaryResponse toSummary(User user);

    @Mapping(target = "departmentId", source = "department.id")
    @Mapping(target = "departmentName", source = "department.name")
    @Mapping(target = "teamId", source = "team.id")
    @Mapping(target = "teamName", source = "team.name")
    @Mapping(target = "roles", expression = "java(mapRoleCodes(user.getRoles()))")
    @Mapping(target = "status", expression = "java(user.getStatus().name())")
    UserResponse toResponse(User user);

    default Set<String> mapRoleCodes(Set<Role> roles) {
        return roles.stream().map(Role::getCode).collect(Collectors.toSet());
    }
}

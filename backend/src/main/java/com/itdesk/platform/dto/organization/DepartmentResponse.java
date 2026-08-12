package com.itdesk.platform.dto.organization;

public record DepartmentResponse(
        Long id,
        String name,
        String description,
        long teamCount
) {
}

package com.itdesk.platform.dto.organization;

public record TeamResponse(
        Long id,
        String name,
        String description,
        Long departmentId,
        String departmentName
) {
}

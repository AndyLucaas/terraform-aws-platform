package com.itdesk.platform.dto.ticket;

import java.util.List;

public record CategoryResponse(Long id, String name, Long parentId, List<CategoryResponse> subCategories) {
}

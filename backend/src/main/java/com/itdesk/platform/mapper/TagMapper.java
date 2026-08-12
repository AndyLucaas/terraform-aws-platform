package com.itdesk.platform.mapper;

import com.itdesk.platform.dto.ticket.TagResponse;
import com.itdesk.platform.entity.Tag;
import org.mapstruct.Mapper;

import java.util.Set;

@Mapper(componentModel = "spring")
public interface TagMapper {

    TagResponse toResponse(Tag tag);

    Set<TagResponse> toResponseSet(Set<Tag> tags);
}

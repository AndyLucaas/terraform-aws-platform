package com.itdesk.platform.mapper;

import com.itdesk.platform.dto.comment.CommentResponse;
import com.itdesk.platform.entity.Comment;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring", uses = UserMapper.class)
public interface CommentMapper {

    @org.mapstruct.Mapping(target = "author", source = "author")
    CommentResponse toResponse(Comment comment);
}

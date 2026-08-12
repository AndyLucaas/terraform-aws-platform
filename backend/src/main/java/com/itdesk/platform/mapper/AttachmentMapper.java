package com.itdesk.platform.mapper;

import com.itdesk.platform.dto.attachment.AttachmentResponse;
import com.itdesk.platform.entity.Attachment;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface AttachmentMapper {

    @Mapping(target = "uploadedById", source = "uploadedBy.id")
    @Mapping(target = "uploadedByName", expression = "java(attachment.getUploadedBy().getFirstName() + \" \" + attachment.getUploadedBy().getLastName())")
    AttachmentResponse toResponse(Attachment attachment);
}

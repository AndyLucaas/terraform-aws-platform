package com.itdesk.platform.mapper;

import com.itdesk.platform.dto.notification.NotificationResponse;
import com.itdesk.platform.entity.Notification;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface NotificationMapper {

    @Mapping(target = "type", expression = "java(notification.getType().name())")
    @Mapping(target = "ticketId", source = "ticket.id")
    @Mapping(target = "ticketReference", source = "ticket.reference")
    NotificationResponse toResponse(Notification notification);
}

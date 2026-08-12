package com.itdesk.platform.mapper;

import com.itdesk.platform.dto.ticket.TicketPriorityResponse;
import com.itdesk.platform.dto.ticket.TicketStatusResponse;
import com.itdesk.platform.entity.TicketPriority;
import com.itdesk.platform.entity.TicketStatus;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface TicketReferenceDataMapper {

    TicketStatusResponse toResponse(TicketStatus status);

    TicketPriorityResponse toResponse(TicketPriority priority);
}

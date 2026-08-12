package com.itdesk.platform.mapper;

import com.itdesk.platform.dto.ticket.TicketResponse;
import com.itdesk.platform.dto.ticket.TicketSummaryResponse;
import com.itdesk.platform.entity.Ticket;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = {UserMapper.class, CategoryMapper.class, TagMapper.class, TicketReferenceDataMapper.class})
public interface TicketMapper {

    @Mapping(target = "teamId", source = "team.id")
    @Mapping(target = "teamName", source = "team.name")
    TicketResponse toResponse(Ticket ticket);

    TicketSummaryResponse toSummary(Ticket ticket);
}

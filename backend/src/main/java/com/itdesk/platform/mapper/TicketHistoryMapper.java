package com.itdesk.platform.mapper;

import com.itdesk.platform.dto.ticket.TicketHistoryResponse;
import com.itdesk.platform.entity.TicketHistory;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring", uses = UserMapper.class)
public interface TicketHistoryMapper {

    TicketHistoryResponse toResponse(TicketHistory ticketHistory);
}

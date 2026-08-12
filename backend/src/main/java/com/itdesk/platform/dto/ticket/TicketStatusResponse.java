package com.itdesk.platform.dto.ticket;

public record TicketStatusResponse(Long id, String code, String label, boolean closedState, String colorHex) {
}

package com.itdesk.platform.dto.ticket;

public record TicketPriorityResponse(Long id, String code, String label, Integer slaHours, String colorHex) {
}

package com.itdesk.platform.util;

import org.springframework.stereotype.Component;

import java.time.Year;

/**
 * Génère une référence lisible et stable pour un ticket, au format
 * INC-{année}-{id séquentiel}, indépendante de la clé primaire technique.
 */
@Component
public class TicketReferenceGenerator {

    private static final String PREFIX = "INC";

    public String generate(long sequentialId) {
        return "%s-%d-%06d".formatted(PREFIX, Year.now().getValue(), sequentialId);
    }
}

package com.itdesk.platform.exception;

/**
 * Signale la violation d'une règle métier (transition de statut invalide,
 * assignation impossible, etc.) plutôt qu'une erreur technique.
 */
public class BusinessRuleException extends RuntimeException {

    public BusinessRuleException(String message) {
        super(message);
    }
}

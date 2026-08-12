CREATE SCHEMA IF NOT EXISTS itdesk;

SET search_path TO itdesk;

-- =========================================================================
-- ORGANISATION
-- =========================================================================

CREATE TABLE departments (
    id              BIGSERIAL PRIMARY KEY,
    name            VARCHAR(100)    NOT NULL,
    description     VARCHAR(500),
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ     NOT NULL DEFAULT now(),
    CONSTRAINT uq_departments_name UNIQUE (name)
);

CREATE TABLE teams (
    id              BIGSERIAL PRIMARY KEY,
    name            VARCHAR(100)    NOT NULL,
    description     VARCHAR(500),
    department_id   BIGINT          NOT NULL REFERENCES departments (id) ON DELETE RESTRICT,
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ     NOT NULL DEFAULT now(),
    CONSTRAINT uq_teams_name_department UNIQUE (name, department_id)
);

CREATE INDEX idx_teams_department_id ON teams (department_id);

-- =========================================================================
-- RBAC : ROLES / PERMISSIONS / USERS
-- =========================================================================

CREATE TABLE roles (
    id              BIGSERIAL PRIMARY KEY,
    code            VARCHAR(50)     NOT NULL,
    name            VARCHAR(100)    NOT NULL,
    description     VARCHAR(500),
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT now(),
    CONSTRAINT uq_roles_code UNIQUE (code)
);

CREATE TABLE permissions (
    id              BIGSERIAL PRIMARY KEY,
    code            VARCHAR(100)    NOT NULL,
    description     VARCHAR(500),
    CONSTRAINT uq_permissions_code UNIQUE (code)
);

CREATE TABLE role_permissions (
    role_id         BIGINT NOT NULL REFERENCES roles (id) ON DELETE CASCADE,
    permission_id   BIGINT NOT NULL REFERENCES permissions (id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);

CREATE TABLE users (
    id                  BIGSERIAL PRIMARY KEY,
    keycloak_id         UUID            NOT NULL,
    username            VARCHAR(100)    NOT NULL,
    email               VARCHAR(255)    NOT NULL,
    first_name          VARCHAR(100)    NOT NULL,
    last_name           VARCHAR(100)    NOT NULL,
    phone_number        VARCHAR(30),
    avatar_url          VARCHAR(500),
    job_title           VARCHAR(100),
    department_id       BIGINT          REFERENCES departments (id) ON DELETE SET NULL,
    team_id             BIGINT          REFERENCES teams (id) ON DELETE SET NULL,
    status              VARCHAR(20)     NOT NULL DEFAULT 'ACTIVE',
    available           BOOLEAN         NOT NULL DEFAULT true,
    locale              VARCHAR(10)     NOT NULL DEFAULT 'fr',
    created_at          TIMESTAMPTZ     NOT NULL DEFAULT now(),
    updated_at          TIMESTAMPTZ     NOT NULL DEFAULT now(),
    last_login_at       TIMESTAMPTZ,
    CONSTRAINT uq_users_keycloak_id UNIQUE (keycloak_id),
    CONSTRAINT uq_users_username UNIQUE (username),
    CONSTRAINT uq_users_email UNIQUE (email),
    CONSTRAINT ck_users_status CHECK (status IN ('ACTIVE', 'BLOCKED', 'PENDING'))
);

CREATE INDEX idx_users_department_id ON users (department_id);
CREATE INDEX idx_users_team_id ON users (team_id);
CREATE INDEX idx_users_status ON users (status);

CREATE TABLE user_roles (
    user_id         BIGINT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    role_id         BIGINT NOT NULL REFERENCES roles (id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, role_id)
);

CREATE INDEX idx_user_roles_role_id ON user_roles (role_id);

-- =========================================================================
-- TICKETS : REFERENTIELS
-- =========================================================================

CREATE TABLE ticket_statuses (
    id              BIGSERIAL PRIMARY KEY,
    code            VARCHAR(30)     NOT NULL,
    label           VARCHAR(100)    NOT NULL,
    display_order   SMALLINT        NOT NULL DEFAULT 0,
    is_closed_state BOOLEAN         NOT NULL DEFAULT false,
    color_hex       VARCHAR(7),
    CONSTRAINT uq_ticket_statuses_code UNIQUE (code)
);

CREATE TABLE ticket_priorities (
    id              BIGSERIAL PRIMARY KEY,
    code            VARCHAR(30)     NOT NULL,
    label           VARCHAR(100)    NOT NULL,
    display_order   SMALLINT        NOT NULL DEFAULT 0,
    sla_hours       INTEGER,
    color_hex       VARCHAR(7),
    CONSTRAINT uq_ticket_priorities_code UNIQUE (code)
);

CREATE TABLE categories (
    id              BIGSERIAL PRIMARY KEY,
    name            VARCHAR(100)    NOT NULL,
    parent_id       BIGINT          REFERENCES categories (id) ON DELETE SET NULL,
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT now(),
    CONSTRAINT uq_categories_name_parent UNIQUE (name, parent_id)
);

CREATE INDEX idx_categories_parent_id ON categories (parent_id);

CREATE TABLE tags (
    id              BIGSERIAL PRIMARY KEY,
    name            VARCHAR(50)     NOT NULL,
    color_hex       VARCHAR(7),
    CONSTRAINT uq_tags_name UNIQUE (name)
);

-- =========================================================================
-- TICKETS
-- =========================================================================

CREATE TABLE tickets (
    id                  BIGSERIAL PRIMARY KEY,
    reference           VARCHAR(20)     NOT NULL,
    title               VARCHAR(200)    NOT NULL,
    description         TEXT            NOT NULL,
    status_id           BIGINT          NOT NULL REFERENCES ticket_statuses (id) ON DELETE RESTRICT,
    priority_id         BIGINT          NOT NULL REFERENCES ticket_priorities (id) ON DELETE RESTRICT,
    category_id         BIGINT          REFERENCES categories (id) ON DELETE SET NULL,
    requester_id        BIGINT          NOT NULL REFERENCES users (id) ON DELETE RESTRICT,
    assignee_id         BIGINT          REFERENCES users (id) ON DELETE SET NULL,
    team_id             BIGINT          REFERENCES teams (id) ON DELETE SET NULL,
    due_date            TIMESTAMPTZ,
    resolved_at         TIMESTAMPTZ,
    closed_at           TIMESTAMPTZ,
    created_at          TIMESTAMPTZ     NOT NULL DEFAULT now(),
    updated_at          TIMESTAMPTZ     NOT NULL DEFAULT now(),
    CONSTRAINT uq_tickets_reference UNIQUE (reference)
);

CREATE INDEX idx_tickets_status_id ON tickets (status_id);
CREATE INDEX idx_tickets_priority_id ON tickets (priority_id);
CREATE INDEX idx_tickets_category_id ON tickets (category_id);
CREATE INDEX idx_tickets_requester_id ON tickets (requester_id);
CREATE INDEX idx_tickets_assignee_id ON tickets (assignee_id);
CREATE INDEX idx_tickets_team_id ON tickets (team_id);
CREATE INDEX idx_tickets_created_at ON tickets (created_at);
CREATE INDEX idx_tickets_due_date ON tickets (due_date);
-- Recherche plein texte sur titre + description
CREATE INDEX idx_tickets_search ON tickets USING GIN (to_tsvector('french', title || ' ' || description));

CREATE TABLE ticket_tags (
    ticket_id       BIGINT NOT NULL REFERENCES tickets (id) ON DELETE CASCADE,
    tag_id          BIGINT NOT NULL REFERENCES tags (id) ON DELETE CASCADE,
    PRIMARY KEY (ticket_id, tag_id)
);

CREATE INDEX idx_ticket_tags_tag_id ON ticket_tags (tag_id);

CREATE TABLE comments (
    id              BIGSERIAL PRIMARY KEY,
    ticket_id       BIGINT          NOT NULL REFERENCES tickets (id) ON DELETE CASCADE,
    author_id       BIGINT          NOT NULL REFERENCES users (id) ON DELETE RESTRICT,
    content         TEXT            NOT NULL,
    is_internal     BOOLEAN         NOT NULL DEFAULT false,
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ     NOT NULL DEFAULT now()
);

CREATE INDEX idx_comments_ticket_id ON comments (ticket_id);
CREATE INDEX idx_comments_author_id ON comments (author_id);

CREATE TABLE attachments (
    id                  BIGSERIAL PRIMARY KEY,
    ticket_id           BIGINT          NOT NULL REFERENCES tickets (id) ON DELETE CASCADE,
    comment_id          BIGINT          REFERENCES comments (id) ON DELETE CASCADE,
    uploaded_by_id       BIGINT          NOT NULL REFERENCES users (id) ON DELETE RESTRICT,
    file_name           VARCHAR(255)    NOT NULL,
    stored_file_name    VARCHAR(255)    NOT NULL,
    content_type        VARCHAR(100)    NOT NULL,
    size_bytes          BIGINT          NOT NULL,
    created_at          TIMESTAMPTZ     NOT NULL DEFAULT now(),
    CONSTRAINT uq_attachments_stored_file_name UNIQUE (stored_file_name),
    CONSTRAINT ck_attachments_size CHECK (size_bytes > 0)
);

CREATE INDEX idx_attachments_ticket_id ON attachments (ticket_id);
CREATE INDEX idx_attachments_comment_id ON attachments (comment_id);

CREATE TABLE ticket_history (
    id              BIGSERIAL PRIMARY KEY,
    ticket_id       BIGINT          NOT NULL REFERENCES tickets (id) ON DELETE CASCADE,
    changed_by_id   BIGINT          NOT NULL REFERENCES users (id) ON DELETE RESTRICT,
    field_name      VARCHAR(50)     NOT NULL,
    old_value       VARCHAR(500),
    new_value       VARCHAR(500),
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT now()
);

CREATE INDEX idx_ticket_history_ticket_id ON ticket_history (ticket_id);
CREATE INDEX idx_ticket_history_created_at ON ticket_history (created_at);

-- =========================================================================
-- NOTIFICATIONS
-- =========================================================================

CREATE TABLE notifications (
    id              BIGSERIAL PRIMARY KEY,
    recipient_id    BIGINT          NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    ticket_id       BIGINT          REFERENCES tickets (id) ON DELETE CASCADE,
    type            VARCHAR(50)     NOT NULL,
    title           VARCHAR(200)    NOT NULL,
    message         VARCHAR(500)    NOT NULL,
    is_read         BOOLEAN         NOT NULL DEFAULT false,
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT now(),
    read_at         TIMESTAMPTZ
);

CREATE INDEX idx_notifications_recipient_id ON notifications (recipient_id);
CREATE INDEX idx_notifications_recipient_unread ON notifications (recipient_id) WHERE is_read = false;
CREATE INDEX idx_notifications_created_at ON notifications (created_at);

-- =========================================================================
-- AUDIT
-- =========================================================================

CREATE TABLE audit_logs (
    id              BIGSERIAL PRIMARY KEY,
    actor_id        BIGINT          REFERENCES users (id) ON DELETE SET NULL,
    action          VARCHAR(100)    NOT NULL,
    entity_type     VARCHAR(100)    NOT NULL,
    entity_id       BIGINT,
    details         TEXT,
    ip_address      VARCHAR(45),
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT now()
);

CREATE INDEX idx_audit_logs_actor_id ON audit_logs (actor_id);
CREATE INDEX idx_audit_logs_entity ON audit_logs (entity_type, entity_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs (created_at);

-- =========================================================================
-- DONNEES DE REFERENCE (statuts, priorites, roles) - pas de donnees de demo
-- =========================================================================

INSERT INTO ticket_statuses (code, label, display_order, is_closed_state, color_hex) VALUES
    ('OPEN', 'Ouvert', 1, false, '#0369A1'),
    ('IN_PROGRESS', 'En cours', 2, false, '#CA8A04'),
    ('PENDING', 'En attente', 3, false, '#6B7280'),
    ('RESOLVED', 'Résolu', 4, true, '#15803D'),
    ('CLOSED', 'Fermé', 5, true, '#1F2937');

INSERT INTO ticket_priorities (code, label, display_order, sla_hours, color_hex) VALUES
    ('LOW', 'Basse', 1, 72, '#15803D'),
    ('MEDIUM', 'Moyenne', 2, 48, '#CA8A04'),
    ('HIGH', 'Haute', 3, 24, '#D97706'),
    ('CRITICAL', 'Critique', 4, 4, '#B91C1C');

INSERT INTO roles (code, name, description) VALUES
    ('ADMINISTRATOR', 'Administrateur', 'Accès complet à la plateforme'),
    ('TECHNICIAN', 'Technicien', 'Traitement et résolution des tickets'),
    ('MANAGER', 'Manager', 'Supervision des équipes et des tickets'),
    ('USER', 'Utilisateur', 'Création et suivi de ses propres tickets');

INSERT INTO permissions (code, description) VALUES
    ('TICKET_CREATE', 'Créer un ticket'),
    ('TICKET_READ_ALL', 'Consulter tous les tickets'),
    ('TICKET_READ_OWN', 'Consulter ses propres tickets'),
    ('TICKET_UPDATE', 'Modifier un ticket'),
    ('TICKET_DELETE', 'Supprimer un ticket'),
    ('TICKET_ASSIGN', 'Assigner un ticket'),
    ('USER_MANAGE', 'Gérer les utilisateurs'),
    ('REPORT_VIEW', 'Consulter les rapports et le tableau de bord');

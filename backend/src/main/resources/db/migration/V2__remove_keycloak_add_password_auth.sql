SET search_path TO itdesk;

-- Suppression du lien Keycloak, plus nécessaire : l'authentification est
-- désormais entièrement gérée par le backend.
ALTER TABLE users DROP CONSTRAINT IF EXISTS uq_users_keycloak_id;
ALTER TABLE users DROP COLUMN IF EXISTS keycloak_id;

-- Mot de passe géré localement (hash BCrypt, jamais en clair).
ALTER TABLE users ADD COLUMN password_hash VARCHAR(255);
ALTER TABLE users ADD COLUMN must_change_password BOOLEAN NOT NULL DEFAULT true;

-- Toute ligne existante (créée avant cette migration, via l'ancien flux
-- Keycloak) n'a pas de mot de passe : on la verrouille plutôt que de laisser
-- une valeur nulle exploitable. Un administrateur devra réinitialiser le mot
-- de passe de ces comptes avant qu'ils puissent se reconnecter.
UPDATE users SET password_hash = '' WHERE password_hash IS NULL;
ALTER TABLE users ALTER COLUMN password_hash SET NOT NULL;

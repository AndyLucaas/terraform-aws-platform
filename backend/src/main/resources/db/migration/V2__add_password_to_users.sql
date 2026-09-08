-- Migration V2: Ajout du champ password pour l'authentification backend et suppression de keycloak_id

ALTER TABLE users ADD COLUMN password VARCHAR(255);

-- Attribution d'un mot de passe par défaut pour les utilisateurs existants ("Password123!")
-- BCrypt hash pour "Password123!"
UPDATE users SET password = '$2a$10$76gXQ8R1E3gXn8Gf.w4jEuK9Hq2R.1W1gE2W3S4T5U6V7W8X9Y0Z.' WHERE password IS NULL;

ALTER TABLE users ALTER COLUMN password SET NOT NULL;

ALTER TABLE users DROP CONSTRAINT IF EXISTS uq_users_keycloak_id;
ALTER TABLE users DROP COLUMN IF EXISTS keycloak_id;

import type { AuthenticatedIdentity } from './types';

/**
 * Stockage des jetons côté navigateur.
 *
 * COMPROMIS DE SÉCURITÉ ASSUMÉ — À LIRE AVANT DE MODIFIER :
 * localStorage est lisible par n'importe quel script s'exécutant sur la page,
 * donc vulnérable au vol de jeton en cas de faille XSS. L'alternative la plus
 * sûre est un cookie httpOnly + SameSite posé par le backend (inaccessible au
 * JavaScript), au prix d'une protection CSRF à réactiver côté serveur.
 * Ce choix convient à un déploiement interne ; pour une exposition publique
 * avec des données sensibles, migrer vers des cookies httpOnly.
 */
const ACCESS_TOKEN_KEY = 'itdesk.accessToken';
const REFRESH_TOKEN_KEY = 'itdesk.refreshToken';
const IDENTITY_KEY = 'itdesk.identity';

export const tokenStorage = {
  getAccessToken(): string | null {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  },

  getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  getIdentity(): AuthenticatedIdentity | null {
    const raw = localStorage.getItem(IDENTITY_KEY);
    if (!raw) {
      return null;
    }
    try {
      return JSON.parse(raw) as AuthenticatedIdentity;
    } catch {
      return null;
    }
  },

  setSession(accessToken: string, refreshToken: string, identity: AuthenticatedIdentity): void {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    localStorage.setItem(IDENTITY_KEY, JSON.stringify(identity));
  },

  setAccessToken(accessToken: string): void {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  },

  clear(): void {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(IDENTITY_KEY);
  },
};

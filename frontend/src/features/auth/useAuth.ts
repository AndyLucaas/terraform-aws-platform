import { useEffect, useMemo, useState } from 'react';
import { keycloak } from './keycloak';
import type { AppRole, AuthenticatedIdentity } from './types';

const ROLE_VALUES: AppRole[] = ['ADMINISTRATOR', 'TECHNICIAN', 'MANAGER', 'USER'];

function buildIdentity(): AuthenticatedIdentity | null {
  const tokenParsed = keycloak.tokenParsed;
  if (!tokenParsed) {
    return null;
  }
  const realmRoles: string[] = tokenParsed.realm_access?.roles ?? [];
  const roles = ROLE_VALUES.filter((role) => realmRoles.includes(role));

  return {
    username: tokenParsed.preferred_username ?? '',
    fullName: `${tokenParsed.given_name ?? ''} ${tokenParsed.family_name ?? ''}`.trim(),
    email: tokenParsed.email ?? '',
    roles,
  };
}

export function useAuth() {
  const [tokenVersion, setTokenVersion] = useState(0);

  useEffect(() => {
    const bump = () => setTokenVersion((current) => current + 1);
    keycloak.onAuthSuccess = bump;
    keycloak.onAuthRefreshSuccess = bump;
    return () => {
      keycloak.onAuthSuccess = undefined;
      keycloak.onAuthRefreshSuccess = undefined;
    };
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps -- tokenVersion force intentionnellement le recalcul après un refresh de token, sans être lu directement dans buildIdentity()
  const identity = useMemo(() => buildIdentity(), [tokenVersion]);

  const hasRole = (role: AppRole): boolean => Boolean(identity?.roles.includes(role));
  const hasAnyRole = (roles: AppRole[]): boolean => roles.some(hasRole);

  const logout = (): void => {
    keycloak.logout({ redirectUri: window.location.origin });
  };

  return { identity, hasRole, hasAnyRole, logout };
}

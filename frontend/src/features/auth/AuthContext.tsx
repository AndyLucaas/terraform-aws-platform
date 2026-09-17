import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { authApi } from './authApi';
import { tokenStorage } from './tokenStorage';
import type { AppRole, AuthenticatedIdentity, LoginCredentials } from './types';

interface AuthContextValue {
  identity: AuthenticatedIdentity | null;
  isAuthenticated: boolean;
  mustChangePassword: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  hasRole: (role: AppRole) => boolean;
  hasAnyRole: (roles: AppRole[]) => boolean;
  clearPasswordChangeRequirement: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [identity, setIdentity] = useState<AuthenticatedIdentity | null>(() => tokenStorage.getIdentity());
  const [mustChangePassword, setMustChangePassword] = useState(false);

  const login = useCallback(async (credentials: LoginCredentials) => {
    const response = await authApi.login(credentials);

    const authenticatedIdentity: AuthenticatedIdentity = {
      id: response.user.id,
      username: response.user.username,
      fullName: `${response.user.firstName} ${response.user.lastName}`.trim(),
      email: response.user.email,
      roles: response.user.roles,
    };

    tokenStorage.setSession(response.accessToken, response.refreshToken, authenticatedIdentity);
    setIdentity(authenticatedIdentity);
    setMustChangePassword(response.mustChangePassword);
  }, []);

  const logout = useCallback(() => {
    tokenStorage.clear();
    setIdentity(null);
    setMustChangePassword(false);
  }, []);

  const value = useMemo<AuthContextValue>(() => {
    const hasRole = (role: AppRole) => Boolean(identity?.roles.includes(role));

    return {
      identity,
      isAuthenticated: identity !== null && tokenStorage.getAccessToken() !== null,
      mustChangePassword,
      login,
      logout,
      hasRole,
      hasAnyRole: (roles: AppRole[]) => roles.some(hasRole),
      clearPasswordChangeRequirement: () => setMustChangePassword(false),
    };
  }, [identity, mustChangePassword, login, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth doit être utilisé à l'intérieur de AuthProvider");
  }
  return context;
}

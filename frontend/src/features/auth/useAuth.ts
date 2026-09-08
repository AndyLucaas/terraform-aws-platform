import { useEffect, useState } from 'react';
import { authApi } from './authApi';
import type { AppRole, AuthenticatedIdentity, LoginCredentials } from './types';

let globalIdentity: AuthenticatedIdentity | null = null;
let listeners: Array<() => void> = [];

function notifyListeners() {
  listeners.forEach((listener) => listener());
}

export function setAuthState(identity: AuthenticatedIdentity | null) {
  globalIdentity = identity;
  notifyListeners();
}

export function useAuth() {
  const [identity, setIdentity] = useState<AuthenticatedIdentity | null>(globalIdentity);
  const [isLoading, setIsLoading] = useState<boolean>(!globalIdentity && Boolean(localStorage.getItem('access_token')));

  useEffect(() => {
    const handleChange = () => setIdentity(globalIdentity);
    listeners.push(handleChange);

    if (!globalIdentity && localStorage.getItem('access_token')) {
      setIsLoading(true);
      authApi
        .getMe()
        .then((user) => {
          setAuthState({
            id: user.id,
            username: user.username,
            fullName: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username,
            email: user.email,
            roles: user.roles,
          });
        })
        .catch(() => {
          setAuthState(null);
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
        })
        .finally(() => {
          setIsLoading(false);
        });
    }

    return () => {
      listeners = listeners.filter((l) => l !== handleChange);
    };
  }, []);

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    try {
      const data = await authApi.login(credentials);
      const user = data.user;
      const newIdentity: AuthenticatedIdentity = {
        id: user.id,
        username: user.username,
        fullName: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username,
        email: user.email,
        roles: user.roles,
      };
      setAuthState(newIdentity);
      return newIdentity;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await authApi.logout();
    setAuthState(null);
    window.location.href = '/login';
  };

  const hasRole = (role: AppRole): boolean => Boolean(identity?.roles.includes(role));
  const hasAnyRole = (roles: AppRole[]): boolean => roles.some(hasRole);

  return {
    identity,
    isAuthenticated: Boolean(identity),
    isLoading,
    login,
    logout,
    hasRole,
    hasAnyRole,
  };
}

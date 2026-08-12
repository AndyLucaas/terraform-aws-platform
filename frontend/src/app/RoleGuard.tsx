import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/useAuth';
import type { AppRole } from '@/features/auth/types';

interface RoleGuardProps {
  roles: AppRole[];
  children: ReactNode;
}

export function RoleGuard({ roles, children }: RoleGuardProps) {
  const { hasAnyRole } = useAuth();

  if (!hasAnyRole(roles)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

export type AppRole = 'ADMINISTRATOR' | 'TECHNICIAN' | 'MANAGER' | 'USER';

export interface AuthenticatedIdentity {
  username: string;
  fullName: string;
  email: string;
  roles: AppRole[];
}

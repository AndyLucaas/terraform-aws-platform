export type AppRole = 'ADMINISTRATOR' | 'TECHNICIAN' | 'MANAGER' | 'USER';

export interface AuthenticatedIdentity {
  id?: number;
  username: string;
  fullName: string;
  email: string;
  roles: AppRole[];
}

export interface UserBackendResponse {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: AppRole[];
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  user: UserBackendResponse;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

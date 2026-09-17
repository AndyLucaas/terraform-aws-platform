export type AppRole = 'ADMINISTRATOR' | 'TECHNICIAN' | 'MANAGER' | 'USER';

export interface AuthenticatedIdentity {
  id: number;
  username: string;
  fullName: string;
  email: string;
  roles: AppRole[];
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  expiresInSeconds: number;
  mustChangePassword: boolean;
  user: {
    id: number;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    roles: AppRole[];
  };
}

export interface RefreshTokenResponse {
  accessToken: string;
  expiresInSeconds: number;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export type AppRole = 'ADMINISTRATOR' | 'TECHNICIAN' | 'MANAGER' | 'USER';
export type UserStatus = 'ACTIVE' | 'BLOCKED' | 'PENDING';

export interface UserAccount {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  avatarUrl?: string;
  jobTitle?: string;
  departmentId?: number;
  departmentName?: string;
  teamId?: number;
  teamName?: string;
  status: UserStatus;
  available: boolean;
  locale: string;
  roles: AppRole[];
  lastLoginAt?: string;
  createdAt: string;
}

export interface UserFormPayload {
  username?: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  jobTitle?: string;
  departmentId?: number;
  teamId?: number;
  roleCodes: AppRole[];
}

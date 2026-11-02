import { UserRole } from '../types';

const ROLE_LABELS: Record<UserRole, string> = {
  student: 'Cadet',
  instructor: 'Instructor',
  admin: 'Admin',
};

export const getRoleLabel = (role: UserRole) => ROLE_LABELS[role];

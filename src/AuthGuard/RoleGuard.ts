import { SetMetadata } from '@nestjs/common';
import { Role } from 'src/userroles';

export const ROLES_KEY = 'roles';
export const RoleGuard = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
import { SetMetadata } from '@nestjs/common';
import { Role } from '../enums/role.enum';

export const Auth = (...roles: Role[]) => SetMetadata('auth_role', roles);


import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ValidRoles } from 'src/auth/interfaces';
import { UserRoleGuard } from '../guards/user-role/user-role.guard';
import { RoleProtected } from './role-protected/role-protected.decorator';

export function Auth(...roles: ValidRoles[]) {    
  return applyDecorators(
      RoleProtected(...roles),
      UseGuards(AuthGuard('jwt'), UserRoleGuard),    
  );
}

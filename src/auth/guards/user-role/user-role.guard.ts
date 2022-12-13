import { BadRequestException, CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class UserRoleGuard implements CanActivate {

  
  constructor(private readonly reflector:Reflector) {
    
    
  }
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const validRoles = this.reflector.get('roles',context.getHandler());
    const req= context.switchToHttp().getRequest();
    const user = req.user as User;
    if (!user){
      throw new BadRequestException('User not found');
    }
    for (const role of user.roles) {
      if (validRoles.includes(role)) {
              return true;
            }      
    }    
        throw new ForbiddenException(`El user ${user.fullName} needs a validRole: ${validRoles}`)
  }
}

import { REFRESH_TOKEN_SECRET } from '../configs/app';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Inject,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Role } from '../enums/role.enum';

@Injectable()
export class AuthRefreshGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @Inject(JwtService) private jwtService: JwtService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    try {
      const requiredRoles = this.reflector.getAllAndOverride<Role[]>(
        'auth_role',
        [context.getHandler(), context.getClass()],
      );

      const req = context.switchToHttp().getRequest();
      const token = req.headers['authorization']?.replace(/^bearer\s/gi, '');

      console.log(REFRESH_TOKEN_SECRET, token);

      if (!token) {
        throw new UnauthorizedException();
      }

      const user = this.jwtService.verify(token, {
        secret: REFRESH_TOKEN_SECRET,
      });
      console.log(user, requiredRoles);

      const isValidRole = requiredRoles.some((role) => role === user?.role);
      if (!isValidRole && requiredRoles?.length > 0) {
        throw new UnauthorizedException();
      }

      delete user.iat;
      delete user.exp;
      user.token = token;
      req.user = user;

      return true;
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}

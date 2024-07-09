import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Inject,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthUserRefreshGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @Inject(JwtService) private jwtService: JwtService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    try {
      const req = context.switchToHttp().getRequest();
      const token = req.headers['authorization']?.replace(/^bearer\s/gi, '');

      if (!token) {
        throw new UnauthorizedException();
      }

      const decoded = this.jwtService.verify(token, {
        secret: 'Mysecret',
      });

      if (decoded?.role !== 'user') {
        throw new UnauthorizedException();
      }

      delete decoded.iat;
      delete decoded.exp;
      req.user = decoded;

      return true;
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}

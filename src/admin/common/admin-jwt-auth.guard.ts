import {
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

export class AdminJwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
      throw new UnauthorizedException('No customer token provided');
    }

    const [type, token] = authHeader.split(' ');

    if (type != 'Bearer' || !token) {
      throw new UnauthorizedException('Invalid token format');
    }

    try {
      const payload = jwt.verify(token, 'ADMINS_SECRET');
      req.admin = payload;
      return true;
    } catch (err) {
      throw new UnauthorizedException('Invalid request');
    }
  }
}

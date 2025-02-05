import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Scope,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { User } from '@/users/user.entity';
import { UsersService } from '@/users/users.service';
import { SignInDto } from './dto/sign-in.dto';

export const AUTH_SYMBOL = Symbol('AuthGuard');

export interface AuthRequest extends Request {
  [AUTH_SYMBOL]: User;
}

/**
 * Verify JWT token from Bearer header and put User model in request object
 *
 * @throws {UnauthorizedException}
 */
@Injectable({ scope: Scope.REQUEST })
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthRequest>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('unauthorized');
    }

    try {
      const payload = await this.jwtService.verifyAsync<SignInDto>(token);
      const user = await this.usersService.findOne({
        username: payload.username,
      });

      if (!user) {
        throw new UnauthorizedException('unauthorized');
      }

      request[AUTH_SYMBOL] = user;
    } catch {
      throw new UnauthorizedException('unauthorized');
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}

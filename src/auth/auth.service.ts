// https://docs.nestjs.com/security/authentication#implementing-the-sign-in-endpoint

import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(username: string, pass: string): Promise<{ token: string }> {
    const user = await this.usersService.findOne({ username });

    if (!user) {
      throw new NotFoundException();
    }

    if (!(await bcrypt.compare(pass, user.password))) {
      throw new UnauthorizedException();
    }

    const payload = {
      id: user.id,
      username,
    };

    const token = await this.jwtService.signAsync(payload, {});

    return { token };
  }
}

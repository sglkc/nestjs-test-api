// https://docs.nestjs.com/security/authentication#implementing-the-sign-in-endpoint

import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '@/users/users.service';
import { CreateUserDto } from '@/users/dto/create-user.dto';
import { User } from '@/users/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signToken(user: User) {
    const payload = {
      id: user.id,
      username: user.username,
      email: user.email,
    };

    return await this.jwtService.signAsync(payload);
  }

  async register(
    userDto: CreateUserDto,
  ): Promise<{ user: User; token: string }> {
    const user = await this.usersService.create(userDto);

    if (!user) {
      throw new UnprocessableEntityException();
    }

    return {
      token: await this.signToken(user),
      user,
    };
  }

  async signIn(
    username: string,
    pass: string,
  ): Promise<{ user: User; token: string }> {
    const user = await this.usersService.findOne({ username });

    if (!user) {
      throw new NotFoundException();
    }

    if (!(await bcrypt.compare(pass, user.password))) {
      throw new UnauthorizedException();
    }

    return {
      token: await this.signToken(user),
      user,
    };
  }
}

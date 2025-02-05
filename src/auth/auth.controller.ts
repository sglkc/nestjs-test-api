import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { SuccessResponse } from '@/responses/decorator/success.decorator';
import { ErrorResponse } from '@/responses/decorator/error.decorator';
import { ReadUserDto } from '@/users/dto/read-user.dto';
import { User } from '@/users/user.entity';
import { CreateUserDto } from '@/users/dto/create-user.dto';
import { RegisterDto } from './dto/register.dto';
import { SignInDto } from './dto/sign-in.dto';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { AuthUser } from './auth-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ErrorResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    description: 'User payload has duplicate',
    message: 'userDuplicate',
  })
  @ErrorResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'User payload is not valid',
    message: 'payloadInvalid',
  })
  @SuccessResponse({
    description: 'Register a new user',
    data: RegisterDto,
  })
  register(@Body() userDto: CreateUserDto) {
    return this.authService.register(userDto);
  }

  @Post('login')
  @ErrorResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'User not found',
    message: 'wrongCredentials',
  })
  @SuccessResponse({
    status: HttpStatus.OK,
    description: 'Log in to a user account',
    data: RegisterDto,
  })
  @HttpCode(HttpStatus.OK)
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto.username, signInDto.password);
  }

  @Get('profile')
  @ApiBearerAuth('token')
  @UseGuards(AuthGuard)
  @ErrorResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'User not logged in',
    message: 'unauthorized',
  })
  @SuccessResponse({
    description: 'Get currently logged in user',
    data: ReadUserDto,
  })
  getProfile(@AuthUser() user: User) {
    return user;
  }
}

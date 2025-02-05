import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { SignInDto } from './dto/sign-in.dto';
import { AUTH_SYMBOL, AuthRequest } from './auth.guard';

export const AuthUser = createParamDecorator<
  keyof SignInDto,
  string | SignInDto
>((data, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest<AuthRequest>();
  const user = request[AUTH_SYMBOL];

  return data ? user[data] : user;
});

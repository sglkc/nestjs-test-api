import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { SignInDto } from './dto/sign-in.dto';
import { AuthRequest } from './auth.guard';

// TODO: use user model?
export const AuthUser = createParamDecorator<
  keyof SignInDto,
  string | SignInDto
>((data, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest<AuthRequest>();
  const credentials = request.credentials!;

  return data ? credentials?.[data] : credentials;
});

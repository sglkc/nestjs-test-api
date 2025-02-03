import { ApiProperty } from '@nestjs/swagger';
import { IsJWT } from 'class-validator';
import { UserDto } from 'src/users/dto/user.dto';

export class RegisterDto {
  @ApiProperty()
  @IsJWT()
  token: string;

  @ApiProperty()
  user: UserDto;
}

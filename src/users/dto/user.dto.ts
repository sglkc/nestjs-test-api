import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNumber, IsString, IsStrongPassword } from 'class-validator';
import { User } from '../user.entity';

export class UserDto implements User {
  @ApiProperty()
  @IsNumber()
  id: number;

  @ApiProperty()
  @IsString()
  username: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsStrongPassword()
  password: string;
}

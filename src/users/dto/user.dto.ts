import { ApiProperty } from '@nestjs/swagger';
// import { Exclude } from 'class-transformer';
import { IsEmail, IsNumber, IsString, IsStrongPassword } from 'class-validator';

export class UserDto {
  @ApiProperty()
  @IsNumber()
  id: string;

  @ApiProperty()
  @IsString()
  username: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsStrongPassword()
  // @Exclude()
  password: string;
}

import { OmitType } from '@nestjs/swagger';
import { UserDto } from './user.dto';

export class ReadUserDto extends OmitType(UserDto, ['password'] as const) {}

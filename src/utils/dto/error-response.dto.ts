import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

// https://medium.com/@amitgal45/nest-js-open-api-just-saves-so-much-time-part-2-6e64a76f2be7
export class ErrorResponseDto {
  @ApiProperty({ default: '' })
  message: string;

  @ApiProperty({ enum: HttpStatus, default: HttpStatus.INTERNAL_SERVER_ERROR })
  code: HttpStatus;

  // @ApiProperty({ default: new Date().toISOString() })
  // date: Date;
}

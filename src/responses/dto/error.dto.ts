import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

// TODO: pass errors
// eslint-disable-next-line
export class ErrorResponseDto<T> {
  @ApiProperty({ default: 'error' })
  message?: string;

  @ApiProperty({ default: 400, enum: HttpStatus })
  status?: number;

  // @ApiProperty()
  // data: T;
}

import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class SuccessResponseDto<T> {
  @ApiProperty({ default: 'success' })
  message?: string;

  @ApiProperty({ default: 200, enum: HttpStatus })
  status?: number;

  @ApiProperty()
  data: T;
}

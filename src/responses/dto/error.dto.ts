import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class ErrorResponseDto {
  @ApiProperty({ default: 'error' })
  message?: string;

  @ApiProperty({ default: 400, enum: HttpStatus })
  status?: number;

  @ApiProperty()
  errors?: string[];
}

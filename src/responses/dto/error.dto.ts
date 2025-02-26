import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { ErrorResponse } from '../interface/error.interface';

/**
 * Create custom named error response schema for Swagger docs with defaults
 */
export function createErrorResponseDto(dto: ErrorResponseDto) {
  abstract class ErrorResponse extends ErrorResponseDto {
    @ApiProperty({ default: dto.status })
    status: HttpStatus;

    @ApiProperty({ default: dto.message })
    message: string;
  }

  const schemaName = dto.message;

  Reflect.defineProperty(ErrorResponse, 'name', {
    writable: false,
    value: `ErrorResponseOf${schemaName}`,
  });

  return ErrorResponse;
}

export class ErrorResponseDto implements Partial<ErrorResponse> {
  @ApiProperty({ default: 500 })
  status?: HttpStatus = 500;

  @ApiProperty({ default: 'error' })
  message?: string = 'error';

  @ApiProperty()
  errors?: string[];
}

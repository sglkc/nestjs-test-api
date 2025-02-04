import { HttpStatus } from '@nestjs/common';

export interface ErrorResponse<T = string> {
  status: HttpStatus;
  message: string;
  errors: T[];
}

import { HttpStatus } from '@nestjs/common';

export interface SuccessResponse<T = unknown> {
  status: HttpStatus;
  message: string;
  data: T;
}

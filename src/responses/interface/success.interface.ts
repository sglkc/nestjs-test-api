import { HttpStatus, Type } from '@nestjs/common';

export interface SuccessResponse<T extends Type | Type[] = Type | Type[]> {
  status: HttpStatus;
  message: string;
  data: T;
}

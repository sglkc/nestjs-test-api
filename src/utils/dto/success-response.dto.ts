import { ApiProperty } from '@nestjs/swagger';

export interface SuccessResponseDto<T> {
  message: string;
  status: number;
  data: T;
}

export class SuccessResponseDto<T extends Function> implements SuccessResponseDto<T> {
  @ApiProperty({ default: 'success' })
  message: string;

  @ApiProperty({ default: 200 })
  status: number;

  @ApiProperty()
  data: T;
}

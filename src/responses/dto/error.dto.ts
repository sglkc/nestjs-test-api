import { ApiProperty } from '@nestjs/swagger';

export class ErrorResponseDto<T> {
  @ApiProperty({ default: 'success' })
  message: string;

  @ApiProperty({ default: 200 })
  status: number;

  // @ApiProperty()
  // data: T;
}

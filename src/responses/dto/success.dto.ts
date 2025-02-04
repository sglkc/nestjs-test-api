import { HttpStatus, Type } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { SuccessResponse } from '../interface/success.interface';

export function createSuccessResponseDto<T extends Type | [Type]>(
  dto: SuccessResponseDto<T>,
) {
  abstract class SuccessResponse extends SuccessResponseDto<T> {
    @ApiProperty({ default: dto.status })
    status: HttpStatus;

    @ApiProperty({ default: dto.message })
    message: string;

    @ApiProperty({ type: dto.data })
    data: T;
  }

  const data: Type = Array.isArray(dto.data) ? dto.data[0] : dto.data;
  const schemaName = `${data.name}${Array.isArray(dto.data) ? 'Array' : ''}`;

  Reflect.defineProperty(SuccessResponse, 'name', {
    writable: false,
    value: `SuccessResponseOf${schemaName}`,
  });

  return SuccessResponse;
}

export class SuccessResponseDto<T extends Type | [Type]>
  implements Partial<SuccessResponse<T>>
{
  @ApiProperty({ default: 200 })
  status?: HttpStatus = 200;

  @ApiProperty({ default: 'success' })
  message?: string = 'success';

  @ApiProperty()
  data: T;
}

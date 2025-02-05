import { applyDecorators, Type } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import {
  SuccessResponseDto,
  createSuccessResponseDto,
} from '../dto/success.dto';
import { ResponseMessage } from './message.decorator';

interface SuccessResponseMetadata {
  description: string;
}

/**
 * Apply response message decorator and response docs
 * @url https://docs.nestjs.com/openapi/operations#advanced-generic-apiresponse
 */
export const SuccessResponse = <T extends Type | [Type]>(
  dto: SuccessResponseDto<T> & SuccessResponseMetadata,
) => {
  const ResponseDto = createSuccessResponseDto(dto);

  return applyDecorators(
    ResponseMessage(dto),
    ApiResponse({
      status: dto.status ?? 200,
      description: dto.description,
      type: ResponseDto,
    }),
  );
};

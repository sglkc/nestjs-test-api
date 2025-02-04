import { applyDecorators, SetMetadata, Type } from '@nestjs/common';
import { ApiExtraModels, ApiResponse } from '@nestjs/swagger';
import {
  SuccessResponseDto,
  createSuccessResponseDto,
} from '../dto/success.dto';

interface SuccessResponseMetadata {
  description: string;
}

export const SUCCESS_RESPONSE_MESSAGE = 'successResponseMessage';

/**
 * Apply success response with custom data model
 * @url https://docs.nestjs.com/openapi/operations#advanced-generic-apiresponse
 */
export const SuccessResponse = <T extends Type | [Type]>(
  dto: SuccessResponseDto<T> & SuccessResponseMetadata,
) => {
  const ResponseDto = createSuccessResponseDto(dto);

  return applyDecorators(
    SetMetadata(SUCCESS_RESPONSE_MESSAGE, dto.message),
    ApiExtraModels(ResponseDto),
    ApiResponse({
      status: dto.status ?? 200,
      description: dto.description,
      type: ResponseDto,
    }),
  );
};

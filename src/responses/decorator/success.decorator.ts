import { applyDecorators, SetMetadata, Type } from '@nestjs/common';
import { ApiExtraModels, ApiInternalServerErrorResponse, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import {
  SuccessResponseDto,
  createSuccessResponseDto,
} from '../dto/success.dto';
import { ErrorResponseDto } from '../dto/error.dto';

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
    ApiOkResponse({
      description: dto.description,
      type: ResponseDto,
    }),
    ApiInternalServerErrorResponse({
      description: 'Unexpected internal error',
      type: ErrorResponseDto,
    }),
  );
};

import { applyDecorators, SetMetadata, Type } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import {
  SuccessResponseDto,
  createSuccessResponseDto,
} from '../dto/success.dto';

interface SuccessResponseMetadata {
  description: string;
}

export const SUCCESS_RESPONSE_MESSAGE = 'successResponseMessage';

// https://docs.nestjs.com/openapi/operations#advanced-generic-apiresponse
export const SuccessResponse = <T extends Type | [Type]>(
  dto: SuccessResponseDto<T> & SuccessResponseMetadata,
) => {
  const ResponseDto = createSuccessResponseDto(dto);

  return applyDecorators(
    SetMetadata(SUCCESS_RESPONSE_MESSAGE, dto.message),
    ApiExtraModels(ResponseDto),
    ApiOkResponse({
      description: dto.description,
      schema: {
        $ref: getSchemaPath(ResponseDto),
      },
    }),
  );
};

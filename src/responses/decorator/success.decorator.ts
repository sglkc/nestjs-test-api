import { applyDecorators, SetMetadata, Type } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { SuccessResponseDto } from '../dto/success.dto';

interface SuccessResponseMetadata {
  description: string;
}

export const SUCCESS_RESPONSE_MESSAGE = 'successResponseMessage';

// https://docs.nestjs.com/openapi/operations#advanced-generic-apiresponse
export const SuccessResponse = <T extends Type<unknown>>(
  data: SuccessResponseDto<T> & SuccessResponseMetadata,
) => {
  return applyDecorators(
    SetMetadata(SUCCESS_RESPONSE_MESSAGE, data.message),
    ApiExtraModels(SuccessResponseDto, data.data),
    ApiOkResponse({
      description: data.description,
      schema: {
        title: `SuccessResponseOf${data.data.name}`,
        allOf: [
          { $ref: getSchemaPath(SuccessResponseDto) },
          {
            properties: {
              message: {
                default: data.message,
              },
              data: {
                $ref: getSchemaPath(data.data),
              },
            },
          },
        ],
      },
    }),
  );
};

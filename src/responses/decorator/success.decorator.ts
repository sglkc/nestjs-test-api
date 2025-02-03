import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { SuccessResponseDto } from '../dto/success.dto';

interface SuccessResponseMetadata {
  description: string;
}

// https://docs.nestjs.com/openapi/operations#advanced-generic-apiresponse
export const SuccessResponse = <T extends Type<unknown>>(
  data: SuccessResponseDto<T> & SuccessResponseMetadata,
) => {
  return applyDecorators(
    ApiExtraModels(SuccessResponseDto, data.data),
    ApiOkResponse({
      description: data.description,
      schema: {
        title: `SuccessResponseOf${data.data.name}`,
        allOf: [
          { $ref: getSchemaPath(SuccessResponseDto) },
          {
            properties: {
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

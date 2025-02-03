import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger';
import { ErrorResponseDto } from '../dto/error.dto';

interface ErrorResponseMetadata {
  description: string;
}

// https://docs.nestjs.com/openapi/operations#advanced-generic-apiresponse
export const ErrorResponse = <T extends Type<unknown>>(
  data: ErrorResponseDto<T> & ErrorResponseMetadata,
) => {
  return applyDecorators(
    ApiExtraModels(ErrorResponseDto),
    ApiResponse({
      description: data.description,
      status: data.status,
      schema: {
        allOf: [
          { $ref: getSchemaPath(ErrorResponseDto) },
          {
            properties: {
              status: {
                type: 'number',
                default: data.status,
              },
            },
          },
        ],
      },
    }),
  );
};

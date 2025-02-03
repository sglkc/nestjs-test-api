import { applyDecorators } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger';
import { ErrorResponseDto } from '../dto/error-response.dto';

interface ErrorResponseMetadata {
  description: string;
}

// https://docs.nestjs.com/openapi/operations#advanced-generic-apiresponse
export const ErrorResponse = <T extends Function>(
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
          // {
          //   properties: {
          //     data: {
          //       $ref: getSchemaPath(data.),
          //     },
          //   },
          // },
        ],
      },
    }),
  );
};

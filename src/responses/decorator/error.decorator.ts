import { applyDecorators } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger';
import { ErrorResponseDto } from '../dto/error.dto';

interface ErrorResponseMetadata {
  description: string;
}

export const ERROR_RESPONSE_MESSAGE = 'errorResponseMessage';

// https://docs.nestjs.com/openapi/operations#advanced-generic-apiresponse
export const ErrorResponse = (
  data: ErrorResponseDto & ErrorResponseMetadata,
) => {
  return applyDecorators(
    (_target, _key, descriptor: PropertyDescriptor) => {
      let existingErrors = Reflect.getMetadata(
        ERROR_RESPONSE_MESSAGE,
        descriptor.value as Object,
      ) as ErrorResponseMetadata[] | undefined;

      if (!existingErrors) {
        existingErrors = [data];
      } else {
        existingErrors.push(data);
      }

      Reflect.defineMetadata(
        ERROR_RESPONSE_MESSAGE,
        existingErrors,
        descriptor.value as Object,
      );
    },
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
                default: data.status,
              },
              message: {
                default: data.message,
              },
            },
          },
        ],
      },
    }),
  );
};

import { applyDecorators } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger';
import { createErrorResponseDto, ErrorResponseDto } from '../dto/error.dto';

interface ErrorResponseMetadata {
  description: string;
}

export const ERROR_RESPONSE_MESSAGE = 'errorResponseMessage';

// https://docs.nestjs.com/openapi/operations#advanced-generic-apiresponse
export const ErrorResponse = (
  dto: ErrorResponseDto & ErrorResponseMetadata,
) => {
  const ResponseDto = createErrorResponseDto(dto);

  return applyDecorators(
    (_target, _key, descriptor: PropertyDescriptor) => {
      let existingErrors = Reflect.getMetadata(
        ERROR_RESPONSE_MESSAGE,
        descriptor.value as object,
      ) as ErrorResponseMetadata[] | undefined;

      if (!existingErrors) {
        existingErrors = [dto];
      } else {
        existingErrors.push(dto);
      }

      Reflect.defineMetadata(
        ERROR_RESPONSE_MESSAGE,
        existingErrors,
        descriptor.value as object,
      );
    },
    ApiExtraModels(ErrorResponseDto),
    ApiResponse({
      description: dto.description,
      status: dto.status,
      type: ResponseDto,
    }),
  );
};

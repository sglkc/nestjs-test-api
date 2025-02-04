import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { createErrorResponseDto, ErrorResponseDto } from '../dto/error.dto';
import { ResponseMessage } from './message.decorator';

interface ErrorResponseMetadata {
  description: string;
}

// https://docs.nestjs.com/openapi/operations#advanced-generic-apiresponse
export const ErrorResponse = (
  dto: ErrorResponseDto & ErrorResponseMetadata,
) => {
  const ResponseDto = createErrorResponseDto(dto);

  return applyDecorators(
    ResponseMessage(dto),
    ApiResponse({
      description: dto.description,
      status: dto.status,
      type: ResponseDto,
    }),
  );
};

import { ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ErrorResponse } from './interface/error.interface';
import { ERROR_RESPONSE_MESSAGE } from './decorator/error.decorator';

export function handleError(
  error: unknown,
  context?: ExecutionContext,
  reflector?: Reflector,
): ErrorResponse {
  const status: HttpStatus =
    error instanceof HttpException
      ? error.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

  let message = 'error';
  let errors: string[] = [];

  if (error instanceof HttpException) {
    const res = error.getResponse() as { message: string | string[] };
    errors = Array.isArray(res.message) ? res.message : [res.message];

    if (reflector && context) {
      const errorResponses =
        reflector.get<ErrorResponse[]>(
          ERROR_RESPONSE_MESSAGE,
          context.getHandler(),
        ) || [];

      const matchedError = errorResponses.find((err) => err.status === status);
      if (matchedError) {
        message = matchedError.message;
      }
    }
  }

  return {
    status,
    message,
    errors,
  };
}

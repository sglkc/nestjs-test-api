import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorResponse } from './interface/error.interface';
import { ResponseMessages } from './decorator/message.decorator';

/**
 * Format error object with default to 500 Internal Server Error
 */
export function handleError(
  error: Error,
  messages?: ResponseMessages,
): ErrorResponse {
  const status: HttpStatus =
    error instanceof HttpException
      ? error.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

  const message = messages
    ? (messages[status] ?? 'internalServerError')
    : error.message;
  let errors: string[] = [];

  if (error instanceof HttpException) {
    const res = error.getResponse() as {
      message: string | string[];
      errors?: string[];
    };

    errors = Array.isArray(res.errors)
      ? res.errors
      : Array.isArray(res.message)
        ? res.message
        : [res.message];
  }

  return {
    status,
    message,
    errors,
  };
}

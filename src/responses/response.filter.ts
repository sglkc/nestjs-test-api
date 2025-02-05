import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { handleError } from './response.utils';
import { ErrorResponse } from './interface/error.interface';

/**
 * Handle guard errors and uncaught exceptions
 * Intercepted responses goes here too
 * @see {@link https://docs.nestjs.com/faq/request-lifecycle#summary}
 */
@Catch()
export class ResponseExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception instanceof HttpException) {
      const errorResponse = handleError(exception);

      return response
        .status(errorResponse.status)
        .json(errorResponse satisfies ErrorResponse);
    }

    return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      message: exception.name,
      status: 500,
      errors: [exception.message],
    } satisfies ErrorResponse);
  }
}

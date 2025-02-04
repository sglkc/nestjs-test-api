import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';
import { handleError } from './response.utils';
import { ErrorResponse } from './interface/error.interface';

@Catch()
export class ResponseExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const errorResponse = handleError(exception);

    response
      .status(errorResponse.status)
      .json(errorResponse satisfies ErrorResponse);
  }
}

import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Response } from 'express';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { SuccessResponse } from './interface/success.interface';
import { ErrorResponse } from './interface/error.interface';
import { SUCCESS_RESPONSE_MESSAGE } from './decorator/success.decorator';
import { ERROR_RESPONSE_MESSAGE } from './decorator/error.decorator';

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, SuccessResponse<T>>
{
  constructor(private readonly reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<SuccessResponse<T>> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse<Response>();
    const message =
      this.reflector.get<string>(
        SUCCESS_RESPONSE_MESSAGE,
        context.getHandler(),
      ) || 'success';

    // TODO: handle message from controller decorator
    return next.handle().pipe(
      map<T, SuccessResponse<T>>((data) => ({
        status: response.statusCode,
        message,
        data,
      })),
      catchError((error) => this.handleError(error, context)),
    );
  }

  handleError(error: unknown, context: ExecutionContext) {
    const errorResponses =
      this.reflector.get<ErrorResponse[]>(
        ERROR_RESPONSE_MESSAGE,
        context.getHandler(),
      ) || [];

    console.log(errorResponses);
    const status: HttpStatus =
      error instanceof HttpException
        ? error.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let message = 'error';

    let errors: string[] = [];

    if (error instanceof HttpException) {
      const res = error.getResponse() as { message: string | string[] };
      errors = Array.isArray(res.message) ? res.message : [res.message];

      // Try to match with decorator metadata to use a predefined error message
      if (Array.isArray(errorResponses)) {
        const matchedError = errorResponses.find(
          (err) => err.status === status,
        );

        if (matchedError) {
          message = matchedError.message;
        }
      }
    }

    return throwError(
      () =>
        new HttpException(
          {
            status,
            message,
            errors,
          } satisfies ErrorResponse,
          status,
        ),
    );
  }
}

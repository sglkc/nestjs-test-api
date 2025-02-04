import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Response } from 'express';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { SuccessResponse } from './interface/success.interface';
import { handleError } from './response.utils';
import { SUCCESS_RESPONSE_MESSAGE } from './decorator/success.decorator';

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

    return next.handle().pipe(
      map<T, SuccessResponse<T>>((data) => ({
        status: response.statusCode,
        message,
        data,
      })),
      catchError((error) => {
        const response = handleError(error, context, this.reflector);
        return throwError(() => new HttpException(response, response.status));
      }),
    );
  }
}

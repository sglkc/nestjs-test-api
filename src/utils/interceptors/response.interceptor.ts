import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Response } from 'express';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export interface ApiResponse<T> {
  status: boolean;
  statusCode: number;
  message: string;
  data: T;
}

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, ApiResponse<T>>
{
  @Inject() private reflector: Reflector;

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse<Response>();
    const message = this.reflector.get<string>('', context.getHandler());

    return next.handle().pipe(
      map<T, ApiResponse<T>>((data) => ({
        status: true,
        statusCode: response.statusCode,
        message,
        data,
      })),
      catchError((error) => {
        const status =
          error instanceof HttpException
            ? error.getStatus()
            : HttpStatus.INTERNAL_SERVER_ERROR;

        const message =
          error instanceof HttpException
            ? error.getResponse()
            : 'Internal server error';

        return throwError(
          () =>
            new HttpException(
              {
                status: false,
                statusCode: status,
                message,
                data: null,
              },
              status,
            ),
        );
      }),
    );
  }
}

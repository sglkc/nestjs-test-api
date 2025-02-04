import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  Type,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request, Response } from 'express';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { SuccessResponse } from './interface/success.interface';
import { handleError } from './response.utils';
import { SUCCESS_RESPONSE_MESSAGE } from './decorator/success.decorator';

@Injectable()
export class ResponseInterceptor<T extends Type | Type[]>
  implements NestInterceptor<T, SuccessResponse>
{
  excludePaths: string[] = ['/health'];

  constructor(private readonly reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<SuccessResponse> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();

    if (this.excludePaths.includes(request.path)) {
      return next.handle() as Observable<SuccessResponse>;
    }

    const response = ctx.getResponse<Response>();
    const message =
      this.reflector.get<string>(
        SUCCESS_RESPONSE_MESSAGE,
        context.getHandler(),
      ) || 'success';

    return next.handle().pipe(
      map<T, SuccessResponse>((data) => ({
        status: response.statusCode,
        message,
        data,
      })),
      catchError((error: Error) => {
        const response = handleError(error, context, this.reflector);
        return throwError(() => new HttpException(response, response.status));
      }),
    );
  }
}

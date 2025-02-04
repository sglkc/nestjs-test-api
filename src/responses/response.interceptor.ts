import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  Type,
  HttpStatus,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request, Response } from 'express';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { SuccessResponse } from './interface/success.interface';
import { handleError } from './response.utils';
import {
  RESPONSE_MESSAGES,
  ResponseMessages,
} from './decorator/message.decorator';

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
    const messages =
      this.reflector.get<ResponseMessages | undefined>(
        RESPONSE_MESSAGES,
        context.getHandler(),
      ) ?? {};

    return next.handle().pipe(
      map<T, SuccessResponse>((data) => {
        const status: HttpStatus = response.statusCode;
        const message = messages[status] ?? 'success';

        return {
          status,
          message,
          data,
        } satisfies SuccessResponse;
      }),
      catchError((error: Error) => {
        const response = handleError(error, messages);
        return throwError(() => new HttpException(response, response.status));
      }),
    );
  }
}

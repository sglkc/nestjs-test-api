import { HttpStatus } from '@nestjs/common';
import { ErrorResponseDto } from '../dto/error.dto';

export type ResponseMessages = { [K in HttpStatus]?: string };

export const RESPONSE_MESSAGES = 'responseMessages';

export const ResponseMessage =
  (dto: ErrorResponseDto): MethodDecorator =>
  (_target, _key, descriptor: PropertyDescriptor) => {
    const messages =
      (Reflect.getMetadata(RESPONSE_MESSAGES, descriptor.value as object) as
        | ResponseMessages
        | undefined) ?? {};

    if (!dto.status) return;

    messages[dto.status] = dto.message;
  };

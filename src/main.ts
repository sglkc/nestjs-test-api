import { DiscoveryService, NestFactory, Reflector } from '@nestjs/core';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import {
  ApiResponse,
  DocumentBuilder,
  OpenAPIObject,
  SwaggerModule,
} from '@nestjs/swagger';
import { ResponseInterceptor } from './responses/response.interceptor';
import { ResponseExceptionFilter } from './responses/response.filter';
import { createErrorResponseDto } from './responses/dto/error.dto';

/**
 * Create Swagger document and add default responses to every controller:
 * - 429 Too Many Requests
 * - 500 Internal Server Error
 * @see {@link https://dev.to/micalevisk/nestjs-tip-how-to-attach-decorators-to-all-controllers-without-at-once-bg7|Blog}
 */
function setupSwagger(app: INestApplication): OpenAPIObject {
  const controllers = app.get(DiscoveryService).getControllers();

  const TMRDto = createErrorResponseDto({
    status: HttpStatus.TOO_MANY_REQUESTS,
    message: 'tooManyRequests',
  });

  const ISEDto = createErrorResponseDto({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    message: 'internalServerError',
  });

  for (const controller of controllers) {
    if (!controller.metatype) continue;

    ApiResponse({
      status: HttpStatus.TOO_MANY_REQUESTS,
      description: 'Rate limited, wait 10 seconds for next request',
      type: TMRDto,
    })(controller.metatype);

    ApiResponse({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      description: 'Unexpected internal error',
      type: ISEDto,
    })(controller.metatype);
  }

  const config = new DocumentBuilder()
    .setTitle('Auth Test API')
    .setDescription('Basic auth with NestJS')
    .addSecurity('token', {
      type: 'http',
      scheme: 'bearer',
      in: 'header',
      bearerFormat: 'JWT',
    })
    .build();

  return SwaggerModule.createDocument(app, config);
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  /**
   * Handle guard errors and uncaught exceptions
   * @see {@link https://docs.nestjs.com/faq/request-lifecycle#summary}
   */
  app.useGlobalFilters(new ResponseExceptionFilter());
  app.useGlobalInterceptors(new ResponseInterceptor(app.get(Reflector)));
  app.enableShutdownHooks();

  SwaggerModule.setup('docs', app, setupSwagger(app));

  await app.listen(process.env.PORT ?? 3000);
}
// eslint-disable-next-line
bootstrap();

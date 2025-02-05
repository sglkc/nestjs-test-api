import { Module } from '@nestjs/common';
import { APP_GUARD, DiscoveryModule } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { HealthModule } from './health/health.module';
import { AppDataSourceOptions } from '../typeorm.config';

@Module({
  imports: [
    DiscoveryModule,
    ThrottlerModule.forRoot([
      {
        ttl: 10_000,
        limit: 10,
        blockDuration: 5_000,
      },
    ]),
    TypeOrmModule.forRoot(AppDataSourceOptions),
    UsersModule,
    AuthModule,
    HealthModule,
  ],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}

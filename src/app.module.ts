import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AppDataSourceOptions } from 'typeorm.config';
import { AuthModule } from './auth/auth.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(AppDataSourceOptions),
    UsersModule,
    AuthModule,
    HealthModule,
  ],
})
export class AppModule {}

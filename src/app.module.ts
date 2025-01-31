import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AppDataSourceOptions } from 'typeorm.config';

@Module({
  imports: [TypeOrmModule.forRoot(AppDataSourceOptions), UsersModule],
})
export class AppModule {}

import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { User } from '@/users/user.entity';
import { UsersModule } from '@/users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AppDataSourceOptions } from '../../typeorm.config';

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(AppDataSourceOptions),
        TypeOrmModule.forFeature([User]),
        UsersModule,
        JwtModule.register({
          global: true,
          secret: process.env.JWT_SECRET,
        }),
      ],
      controllers: [AuthController],
      providers: [AuthService],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

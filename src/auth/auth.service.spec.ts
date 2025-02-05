import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { User } from '@/users/user.entity';
import { UsersModule } from '@/users/users.module';
import { AuthService } from './auth.service';
import { AppDataSourceOptions } from '../../typeorm.config';

describe('AuthService', () => {
  let service: AuthService;

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
      providers: [AuthService],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

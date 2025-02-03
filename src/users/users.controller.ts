import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { SuccessResponse } from 'src/utils/decorators/success-response.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @SuccessResponse({
    description: 'User is created',
    message: 'User created',
    status: 201,
    data: CreateUserDto,
  })
  @Get(':id')
  findOne(@Param('id') id: number): Promise<User | null> {
    return this.usersService.findOne({ id });
  }

  @Post()
  async create(@Body() userDto: CreateUserDto): Promise<User | null> {
    return this.usersService.create(userDto);
  }
}

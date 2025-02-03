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
import { SuccessResponse } from '../responses/decorator/success.decorator';
import { ErrorResponse } from '../responses/decorator/error.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @ErrorResponse({
    description: '',
    // data: Failed,
    status: 400,
    message: '',
  })
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

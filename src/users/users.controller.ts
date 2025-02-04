import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  NotFoundException,
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
    description: 'Not found',
    // data: Failed,
    status: 404,
    message: 'User id not found',
  })
  @SuccessResponse({
    description: 'User is created',
    message: 'User created',
    status: 201,
    data: CreateUserDto,
  })
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<User | null> {
    const user = await this.usersService.findOne({ id });

    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }

  @Post()
  async create(@Body() userDto: CreateUserDto): Promise<User | null> {
    return await this.usersService.create(userDto);
  }
}

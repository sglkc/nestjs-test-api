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

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  @SuccessResponse({
    description: 'Get all users',
    data: [CreateUserDto],
  })
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  @ErrorResponse({
    status: 404,
    description: 'Not found',
    message: 'userNotFound',
  })
  @SuccessResponse({
    status: 201,
    description: 'User profile by id',
    data: CreateUserDto,
  })
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

import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  NotFoundException,
  Param,
  UseInterceptors,
} from '@nestjs/common';
import { ReadUserDto } from './dto/read-user.dto';
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
    data: [ReadUserDto],
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
    description: 'User profile by id',
    data: ReadUserDto,
  })
  async findOne(@Param('id') id: number): Promise<User | null> {
    const user = await this.usersService.findOne({ id });

    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findOne(id: User['id']): Promise<User | null> {
    return this.usersRepository.findOneBy({ id });
  }

  async create(userDto: CreateUserDto): Promise<User> {
    const user = this.usersRepository.create(userDto);

    user.password = await bcrypt.hash(userDto.password, 4); // TODO: separate?

    return this.usersRepository.save(user);
  }

  async remove(id: User['id']): Promise<void> {
    await this.usersRepository.delete(id);
  }
}

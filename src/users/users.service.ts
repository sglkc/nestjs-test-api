import { Injectable, UnprocessableEntityException } from '@nestjs/common';
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

  async findOne(query: Partial<User>): Promise<User | null> {
    return this.usersRepository.findOneBy(query);
  }

  // TODO: checking for unique with SELECT + INSERT may cause race condition
  // let database decide on uniqueness and handle the error with filters
  async validate(user: User): Promise<true | null> {
    const exception = new UnprocessableEntityException();

    if (await this.usersRepository.findOneBy({ username: user.username })) {
      exception.message = 'username must be unique';
      throw exception;
    }

    if (await this.usersRepository.findOneBy({ email: user.email })) {
      exception.message = 'email must be unique';
      throw exception;
    }

    return true;
  }

  async create(userDto: CreateUserDto): Promise<User | null> {
    const user = this.usersRepository.create(userDto);

    user.password = await bcrypt.hash(userDto.password, 4);
    await this.validate(user);

    return this.usersRepository.save(user);
  }

  async remove(id: User['id']): Promise<void> {
    await this.usersRepository.delete(id);
  }
}

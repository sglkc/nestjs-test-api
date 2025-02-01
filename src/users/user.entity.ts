import { Exclude } from 'class-transformer';
import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Index('user_username', { unique: true })
  username: string;

  @Column()
  @Index('user_email', { unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;
}

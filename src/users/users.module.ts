// src/users/users.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from '../entities/user.entity';
import { UserRole } from '../entities/user-role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserRole])],
  providers: [UsersService],
  controllers: [UsersController],
  // eslint-disable-next-line prettier/prettier
  exports: [
    UsersService,
    TypeOrmModule.forFeature([User, UserRole]),
  ],
})
export class UsersModule {}

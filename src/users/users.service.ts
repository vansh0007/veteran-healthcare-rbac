/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from '../entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role, UserRole } from '../entities/user-role.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserRole)
    private readonly userRoleRepository: Repository<UserRole>,
  ) {}

  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    try {
      return await bcrypt.hash(password, saltRounds); // Use async hashing
    } catch (error) {
      throw new Error(`Failed to hash password: ${error.message}`);
    }
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find(); // Retrieve all users
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    console.log('Creating user:', createUserDto);
    const { email, password, roles = [], ...userData } = createUserDto;

    // Check if user already exists
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await this.hashPassword(password);

    // Create user
    const user = this.userRepository.create({
      ...userData,
      email,
      password: hashedPassword,
    });

    await this.userRepository.save(user);

    // Assign roles if provided
    if (roles.length > 0) {
      await this.assignRoles(user.id, roles);
    }

    return this.findById(user.id); // Return user with roles populated
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email },
      relations: ['roles', 'roles.organization'],
    });
  }

  async findById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['roles', 'roles.organization'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const { password, roles, ...updateData } = updateUserDto;

    if (password) {
      updateData['password'] = await this.hashPassword(password);
    }

    await this.userRepository.update(id, updateData);
    await this.userRoleRepository.delete({ userId: id });
    await this.assignRoles(id, roles ?? []);

    return this.findById(id);
  }

  async delete(id: number): Promise<void> {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('User not found');
    }
  }

  async assignRoles(
    userId: number,
    roles: Array<{ role: Role; organizationId?: number }>,
  ): Promise<UserRole[]> {
    const user = await this.findById(userId);
    const newRoles = roles.map((role) =>
      this.userRoleRepository.create({
        userId: user.id,
        role: role.role,
        organizationId: role.organizationId,
      }),
    );

    await this.userRoleRepository.save(newRoles);
    return newRoles;
  }

  async validateUser(
    email: string,
    plainPassword: string,
  ): Promise<User | null> {
    const user = await this.findByEmail(email);
    if (user && (await bcrypt.compare(plainPassword, user.password))) {
      return user;
    }
    return null;
  }

  async getUserWithRoles(userId: number): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id: userId },
      relations: ['roles', 'roles.organization'],
    });
  }

  async hasRole(
    userId: number,
    requiredRole: Role,
    organizationId?: number,
  ): Promise<boolean> {
    const user = await this.getUserWithRoles(userId);

    if (!user) {
      return false;
    }

    return user.roles.some((role) => {
      const roleMatch = role.role === requiredRole;
      const orgMatch = organizationId
        ? role.organizationId === organizationId
        : true;
      return roleMatch && orgMatch;
    });
  }
}

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { User } from '../entities/user.entity';
import { UserRole } from '../entities/user-role.entity';
import { Repository } from 'typeorm';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { first } from 'rxjs';

describe('UsersService', () => {
  let service: UsersService;
  let userRepository: Repository<User>;
  let userRoleRepository: Repository<UserRole>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(UserRole),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    userRoleRepository = module.get<Repository<UserRole>>(
      getRepositoryToken(UserRole),
    );
  });

  describe('create', () => {
    it('should create new user', async () => {
      const createUserDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'test@example.com',
        password: 'password',
        name: 'Test User',
      };

      const mockUser = {
        id: 1,
        ...createUserDto,
        password: 'hashedPassword',
        isActive: true,
        roles: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Mock the repository methods
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);
      jest.spyOn(userRepository, 'create').mockReturnValue(mockUser);
      jest.spyOn(userRepository, 'save').mockResolvedValue(mockUser);

      // Mock findById which is called at the end of create()
      jest.spyOn(service, 'findById').mockImplementation((id) => {
        if (id === 1) return Promise.resolve(mockUser as unknown as User);
        throw new NotFoundException('User not found');
      });

      const result = await service.create(createUserDto);

      expect(result).toEqual(mockUser);
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { email: createUserDto.email },
      });
      expect(userRepository.create).toHaveBeenCalledWith({
        ...createUserDto,
        password: expect.any(String), // Hashed password
      });
      expect(userRepository.save).toHaveBeenCalledWith(mockUser);
    });

    it('should throw ConflictException if email exists', async () => {
      const createUserDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'exists@example.com',
        password: 'password',
        name: 'Existing User',
      };

      jest.spyOn(userRepository, 'findOne').mockResolvedValue({
        id: 1,
        ...createUserDto,
      } as unknown as User);

      await expect(service.create(createUserDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });
});

/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';

class MockRolesGuard extends RolesGuard {}
describe('UsersController', () => {
  let controller: UsersController;
  let usersService: UsersService;

  // Mock user data
  const mockUser = {
    id: 1,
    email: 'test@example.com',
    firstName: 'John',
    lastName: 'Doe',
    password: 'password123',
    roles: [],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
          },
        },
        {
          provide: 'RolesGuard',
          useClass: MockRolesGuard,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create()', () => {
    it('should have guards applied', () => {
      const guards = Reflect.getMetadata('__guards__', controller.create);
      expect(guards).toHaveLength(2);
      expect(guards[0]).toEqual(AuthGuard('jwt'));
      expect(guards[1]).toBe(RolesGuard);
    });

    it('should return 201 status code', () => {
      const statusCode = Reflect.getMetadata('__httpCode__', controller.create);
      expect(statusCode).toBe(201);
    });
  });

  describe('getAllUsers()', () => {
    it('should return an array of users', async () => {
      jest.spyOn(usersService, 'findAll').mockResolvedValue([mockUser]);
      const result = await controller.getAllUsers();
      expect(usersService.findAll).toHaveBeenCalled();
      expect(result).toEqual([mockUser]);
    });

    it('should not have any guards applied', () => {
      const guards = Reflect.getMetadata('__guards__', controller.getAllUsers);
      expect(guards).toBeUndefined();
    });
  });
});

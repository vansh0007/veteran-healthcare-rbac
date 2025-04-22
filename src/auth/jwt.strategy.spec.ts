import { JwtStrategy } from './jwt.strategy';
import { UnauthorizedException } from '@nestjs/common';

process.env.JWT_SECRET = 'test-secret';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;
  const mockUsersService = {
    findByEmail: jest.fn(),
  };

  beforeEach(() => {
    strategy = new JwtStrategy(mockUsersService as any);
  });

  it('should validate user with correct payload', async () => {
    const payload = {
      email: 'test@example.com',
      sub: 1,
      roles: [],
      password: 'hashedPassword',
    };

    mockUsersService.findByEmail.mockResolvedValue({
      id: 1,
      email: 'test@example.com',
      password: 'hashedPassword',
      roles: [],
    });

    const result = await strategy.validate(payload);

    expect(result).toEqual({
      id: 1,
      email: 'test@example.com',
      roles: [],
    });
  });

  it('should throw error for invalid user', async () => {
    const payload = {
      email: 'invalid@example.com',
      sub: 1,
      password: 'hashedPassword',
      roles: [],
    };
    mockUsersService.findByEmail.mockResolvedValue(null);

    await expect(strategy.validate(payload)).rejects.toThrow(
      UnauthorizedException,
    );
  });
});

import { AuthController } from './auth.controller';

describe('AuthController', () => {
  let controller: AuthController;
  const mockAuthService = {
    login: jest.fn(),
    validateUser: jest.fn(),
  };

  beforeEach(() => {
    controller = new AuthController(mockAuthService as any);
  });

  describe('login', () => {
    it('should return token on successful login', async () => {
      mockAuthService.login.mockResolvedValue({ accessToken: 'test-token' });
      const result = await controller.login({
        email: 'test@example.com',
        password: 'pass',
      });
      expect(result).toEqual({ accessToken: 'test-token' });
    });
  });

  describe('validateCredentials', () => {
    it('should validate correct credentials', async () => {
      mockAuthService.validateUser.mockResolvedValue({ id: 1 });
      const result = await controller.validateCredentials({
        email: 'test@example.com',
        password: 'pass',
      });
      expect(result).toEqual({ isValid: true });
    });

    it('should reject invalid credentials', async () => {
      mockAuthService.validateUser.mockResolvedValue(null);
      const result = await controller.validateCredentials({
        email: 'wrong@example.com',
        password: 'wrong',
      });
      expect(result).toEqual({ isValid: false });
    });
  });
});

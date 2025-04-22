/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  Controller,
  Post,
  Get,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from '../users/dto/login-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  //   @Public() // Bypass JWT guard
  @Post('validate')
  async validateCredentials(@Body() body: { email: string; password: string }) {
    const user = await this.authService.validateUser(body.email, body.password);
    return { isValid: !!user };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  /**
   * Handle user login by validating credentials and returning a JWT token.
   * @param loginUserDto Data Transfer Object containing the user's login credentials.
   * @returns An object containing the access token.
   */
  async login(@Body() loginUserDto: LoginUserDto) {
    return await this.authService.login(loginUserDto);
  }

  // Add to AuthController
  @Get('verify-hash')
  /**
   * Test function to verify a hash using bcrypt.
   * @returns An object containing the generated hash and a verification boolean.
   */
  async verifyHash() {
    const hash = require('bcryptjs').hashSync('admin123', 10);
    return {
      generatedHash: hash,
      verification: require('bcryptjs').compareSync('admin123', hash),
    };
  }
}

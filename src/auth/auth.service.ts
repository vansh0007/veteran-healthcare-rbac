/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';
import { LoginUserDto } from 'src/users/dto/login-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Validate a user by their email and password.
   * @param email Email address of the user to validate.
   * @param password Password of the user to validate.
   * @returns The user object if the password is valid, otherwise null.
   */
  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (!user || !user.password) {
      console.log('Invalid user or missing password for email:', email);
      return null;
    }
    console.log('Validating user with email:', user.password, password);
    const match = await bcrypt.compare(password, user.password); // Use async bcrypt
    console.log('Password comparison:', {
      storedHash: user.password,
      inputPassword: password,
      match,
    });

    return match ? user : null;
  }

  /**
   * Authenticate a user and return an access token.
   * @param loginUserDto Login credentials of the user to authenticate.
   * @returns An object with a single property, `access_token`, which contains the
   *   JSON Web Token (JWT) to be used for subsequent API requests.
   * @throws UnauthorizedException if the credentials are invalid.
   */
  async login(loginUserDto: LoginUserDto) {
    const user = await this.validateUser(
      loginUserDto.email,
      loginUserDto.password,
    );
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Include roles in the JWT payload for future role-based checks
    const payload = { email: user.email, sub: user.id, roles: user.roles };
    console.log('Payload:', payload, user);
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}

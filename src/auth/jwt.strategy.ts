import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../users/users.service'; // You'll need to inject this
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  /**
   * Initialize the JWT strategy.
   *
   * @param usersService The injected users service.
   *
   * @throws Error if the JWT_SECRET environment variable is not set.
   */
  constructor(private readonly usersService: UsersService) {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET environment variable is not set');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  /**
   * Validates a JWT payload to ensure it matches a real user.
   * @param payload The decoded JWT payload.
   * @returns The essential user information, or throws UnauthorizedException if the user is not found.
   */
  async validate(payload: JwtPayload) {
    const user = await this.usersService.findByEmail(payload.email);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Return only essential information to avoid leaking unnecessary data
    return { id: user.id, email: user.email, roles: user.roles };
  }
}

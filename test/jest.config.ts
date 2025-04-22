import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Test } from '@nestjs/testing';
import { UsersModule } from '../src/users/users.module';
import { AuthService } from '../src/auth/auth.service';
import { JwtStrategy } from '../src/auth/jwt.strategy';
import { RolesGuard } from '../src/auth/roles.guard';
import { OrganizationsModule } from 'src/organizations/organizations.module';

export const createTestingModule = async () => {
  return await Test.createTestingModule({
    imports: [
      ConfigModule.forRoot(),
      PassportModule,
      JwtModule.register({
        secret: 'test-secret',
        signOptions: { expiresIn: '60m' },
      }),
      UsersModule,
      OrganizationsModule,
    ],
    providers: [AuthService, JwtStrategy, RolesGuard],
  }).compile();
};

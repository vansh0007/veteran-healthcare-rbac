import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { OrganizationsModule } from './organizations/organizations.module';
import { PatientRecordsModule } from './patient-records/patient-records.module';
import { AccessControlModule } from './access-control/access-control.module';
import { User } from './entities/user.entity';
import { Organization } from './entities/organization.entity';
import { PatientRecord } from './entities/patient-record.entity';
import { UserRole } from './entities/user-role.entity';
import { AppDataSource } from './data-source';
import { AuditLog } from './entities/audit-log.entity';

import * as dotenv from 'dotenv';
dotenv.config();
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => AppDataSource.options,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [User, UserRole, Organization, PatientRecord, AuditLog],
      synchronize: true, // false in production
    }),
    TypeOrmModule.forFeature([User, Organization, PatientRecord, UserRole]),
    AuthModule,
    UsersModule,
    OrganizationsModule,
    PatientRecordsModule,
    AccessControlModule,
  ],
})
export class AppModule {}

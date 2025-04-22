import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRole } from '../entities/user-role.entity';
import { AccessControlService } from './access-control.service';
import { PatientRecord } from '../entities/patient-record.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserRole, PatientRecord])],
  providers: [AccessControlService],
  exports: [AccessControlService],
})
export class AccessControlModule {}

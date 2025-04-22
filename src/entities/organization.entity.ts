import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  Tree,
  TreeChildren,
  TreeParent,
} from 'typeorm';
import { UserRole } from './user-role.entity';
import { PatientRecord } from './patient-record.entity';

@Entity()
@Tree('materialized-path')
export class Organization {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @TreeChildren()
  children: Organization[];

  @TreeParent()
  parent: Organization;

  @OneToMany(() => UserRole, (userRole) => userRole.organization)
  userRoles: UserRole[];

  @OneToMany(() => PatientRecord, (patientRecord) => patientRecord.organization)
  patientRecords: PatientRecord[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}

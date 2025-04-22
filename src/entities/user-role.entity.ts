import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Organization } from './organization.entity';

export enum Role {
  SYSTEM_ADMIN = 'system_admin',
  ORGANIZATION_OWNER = 'organization_owner',
  ORGANIZATION_ADMIN = 'organization_admin',
  DOCTOR = 'doctor',
  NURSE = 'nurse',
  STAFF = 'staff',
  VIEWER = 'viewer',
  OWNER = 'OWNER',
  ADMIN = 'ADMIN',
}

@Entity()
export class UserRole {
  @PrimaryGeneratedColumn()
  id: number;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  @ManyToOne(() => User, (user) => user.roles)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: number;

  @ManyToOne(() => Organization, (organization) => organization.userRoles)
  @JoinColumn({ name: 'organizationId' })
  organization: Organization;

  @Column()
  organizationId: number;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.VIEWER,
  })
  role: Role;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}

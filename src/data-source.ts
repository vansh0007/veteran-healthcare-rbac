import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { User } from './entities/user.entity';
import { Organization } from './entities/organization.entity';
import { PatientRecord } from './entities/patient-record.entity';
import { UserRole } from './entities/user-role.entity';
import { AuditLog } from './entities/audit-log.entity';

dotenv.config();

console.log('DB_TYPE:', process.env.DB_TYPE);

export const AppDataSource = new DataSource({
  type: (process.env.DB_TYPE?.trim() ?? 'postgres') as 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT ?? '5432'),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true, // Always false in production, use migrations instead
  logging: process.env.NODE_ENV === 'development',
  entities: [User, Organization, PatientRecord, UserRole, AuditLog],
  migrations: ['src/migrations/*.ts'],
  migrationsRun: false, // Set to true to auto-run migrations on app start
  migrationsTableName: 'typeorm_migrations',
  extra: {
    ssl:
      process.env.DB_SSL === 'true'
        ? {
            rejectUnauthorized: false,
          }
        : false,
  },
});

// For CLI usage
if (require.main === module) {
  AppDataSource.initialize()
    .then(() => console.log('Data Source initialized'))
    .catch((err) => {
      console.error('Error during Data Source initialization', err);
      process.exit(1);
    });
}

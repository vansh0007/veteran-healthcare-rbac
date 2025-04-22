// import { MigrationInterface, QueryRunner } from 'typeorm';

// export class InitialSchema1745184866904 implements MigrationInterface {
//   public async up(queryRunner: QueryRunner): Promise<void> {
//     await queryRunner.query(`
//             CREATE TABLE "organization" (
//                 "id" SERIAL PRIMARY KEY,
//                 "name" character varying NOT NULL,
//                 "description" character varying,
//                 "parentId" integer,
//                 "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
//                 "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
//             )
//         `);

//     await queryRunner.query(`
//             CREATE TABLE "user" (
//                 "id" SERIAL PRIMARY KEY,
//                 "email" character varying NOT NULL UNIQUE,
//                 "password" character varying NOT NULL,
//                 "firstName" character varying NOT NULL,
//                 "lastName" character varying NOT NULL,
//                 "isActive" boolean NOT NULL DEFAULT true,
//                 "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
//                 "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
//             )
//         `);

//     await queryRunner.query(`
//             CREATE TYPE "public"."user_role_role_enum" AS ENUM (
//                 'system_admin',
//                 'organization_owner',
//                 'organization_admin',
//                 'doctor',
//                 'nurse',
//                 'staff',
//                 'viewer',
//                 'OWNER',
//                 'ADMIN'
//             )
//         `);

//     await queryRunner.query(`
//             CREATE TABLE "user_role" (
//                 "id" SERIAL PRIMARY KEY,
//                 "userId" integer NOT NULL,
//                 "organizationId" integer NOT NULL,
//                 "role" "public"."user_role_role_enum" NOT NULL DEFAULT 'viewer',
//                 "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
//                 "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
//             )
//         `);

//     await queryRunner.query(`
//             CREATE TABLE "patient_record" (
//                 "id" SERIAL PRIMARY KEY,
//                 "veteranId" character varying NOT NULL,
//                 "firstName" character varying NOT NULL,
//                 "lastName" character varying NOT NULL,
//                 "dateOfBirth" date NOT NULL,
//                 "ssn" character varying NOT NULL UNIQUE,
//                 "medicalHistory" text NOT NULL,
//                 "treatmentPlans" jsonb,
//                 "organizationId" integer NOT NULL,
//                 "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
//                 "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
//             )
//         `);

//     await queryRunner.query(`
//             ALTER TABLE "organization" ADD CONSTRAINT "FK_organization_parent" 
//             FOREIGN KEY ("parentId") REFERENCES "organization"("id") ON DELETE NO ACTION
//         `);

//     await queryRunner.query(`
//             ALTER TABLE "user_role" ADD CONSTRAINT "FK_user_role_user" 
//             FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE
//         `);

//     await queryRunner.query(`
//             ALTER TABLE "user_role" ADD CONSTRAINT "FK_user_role_organization" 
//             FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE CASCADE
//         `);

//     await queryRunner.query(`
//             ALTER TABLE "patient_record" ADD CONSTRAINT "FK_patient_record_organization" 
//             FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE CASCADE
//         `);

//     // Create initial admin user (password: admin123)
//     await queryRunner.query(`
//             INSERT INTO "user" ("email", "password", "firstName", "lastName")
//             VALUES (
//                 'admin@example.com',
//                 '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 
//                 'Admin',
//                 'User'
//             )
//         `);

//     // Create root organization
//     await queryRunner.query(`
//             INSERT INTO "organization" ("name", "description")
//             VALUES (
//                 'Root Organization',
//                 'Main organization for all veterans'
//             )
//         `);

//     // Assign admin role
//     await queryRunner.query(`
//             INSERT INTO "user_role" ("userId", "organizationId", "role")
//             VALUES (1, 1, 'system_admin')
//         `);
//   }

//   public async down(queryRunner: QueryRunner): Promise<void> {
//     await queryRunner.query(
//       `ALTER TABLE "patient_record" DROP CONSTRAINT "FK_patient_record_organization"`,
//     );
//     await queryRunner.query(
//       `ALTER TABLE "user_role" DROP CONSTRAINT "FK_user_role_organization"`,
//     );
//     await queryRunner.query(
//       `ALTER TABLE "user_role" DROP CONSTRAINT "FK_user_role_user"`,
//     );
//     await queryRunner.query(
//       `ALTER TABLE "organization" DROP CONSTRAINT "FK_organization_parent"`,
//     );
//     await queryRunner.query(`DROP TABLE "patient_record"`);
//     await queryRunner.query(`DROP TABLE "user_role"`);
//     await queryRunner.query(`DROP TYPE "public"."user_role_role_enum"`);
//     await queryRunner.query(`DROP TABLE "user"`);
//     await queryRunner.query(`DROP TABLE "organization"`);
//   }
// }

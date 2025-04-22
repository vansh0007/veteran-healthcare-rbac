/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreatePatientRecordDto {
  @IsString()
  @IsNotEmpty()
  veteranId: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  dateOfBirth: string; // Accept as string, convert to Date in service if needed

  @IsString()
  @IsNotEmpty()
  ssn: string;

  @IsString()
  @IsNotEmpty()
  medicalHistory: string;

  @IsNumber()
  @IsNotEmpty()
  organizationId: number;
}

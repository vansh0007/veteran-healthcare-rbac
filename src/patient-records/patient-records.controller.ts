/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { PatientRecordsService } from './patient-records.service';
import { CreatePatientRecordDto } from './dto/create-patient-record.dto';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../access-control/decorators/roles.decorator';
import { Role } from '../entities/user-role.entity';
import { RolesGuard } from '../auth/roles.guard';

@Controller('patient-records')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class PatientRecordsController {
  constructor(private readonly patientRecordsService: PatientRecordsService) {}

  @Get()
  /**
   * Retrieve all patient records.
   *
   * @returns A promise that resolves with an array of all patient records.
   */
  findAll() {
    return this.patientRecordsService.findAll();
  }

  @Get(':id')
  /**
   * Retrieve a specific patient record by its ID.
   *
   * @param id The ID of the patient record to retrieve.
   * @returns A promise that resolves with the patient record if found.
   * @throws Error if the patient record with the specified ID is not found.
   */
  findOne(@Param('id') id: string) {
    return this.patientRecordsService.findOne(+id);
  }

  @Post()
  @Roles(Role.OWNER, Role.ADMIN)
  /**
   * Create a new patient record.
   *
   * @param createPatientRecordDto The data used to create the patient record.
   * @returns A promise that resolves with the newly created patient record.
   */
  create(@Body() createPatientRecordDto: CreatePatientRecordDto) {
    console.log('Creating patient record:', createPatientRecordDto);
    return this.patientRecordsService.create(createPatientRecordDto);
  }
}

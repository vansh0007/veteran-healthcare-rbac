/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePatientRecordDto } from './dto/create-patient-record.dto';
import { PatientRecord } from './../entities/patient-record.entity'; // You need to create this entity

@Injectable()
export class PatientRecordsService {
  /**
   * Constructor for PatientRecordsService.
   * @param patientRecordsRepository The PatientRecord repository injected by TypeORM.
   */
  constructor(
    @InjectRepository(PatientRecord)
    private readonly patientRecordsRepository: Repository<PatientRecord>,
  ) {}

  // Fetch all patient records
  async findAll(): Promise<PatientRecord[]> {
    return this.patientRecordsRepository.find(); // This retrieves all records from the database
  }

  // Fetch a specific patient record by ID
  async findOne(id: number): Promise<PatientRecord> {
    const record = await this.patientRecordsRepository.findOne({
      where: { id },
    });
    if (!record) {
      throw new Error(`Patient record with ID ${id} not found.`);
    }
    return record;
  }

  // Create a new patient record
  async create(
    createPatientRecordDto: CreatePatientRecordDto,
  ): Promise<PatientRecord> {
    console.log(createPatientRecordDto);
    const patientRecord = this.patientRecordsRepository.create(
      createPatientRecordDto,
    );
    return await this.patientRecordsRepository.save(patientRecord);
  }
}

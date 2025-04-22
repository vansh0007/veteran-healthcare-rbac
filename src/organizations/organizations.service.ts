/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TreeRepository } from 'typeorm';
import { Organization } from '../entities/organization.entity';
import { CreateOrganizationDto } from './dto/create-organization.dto';

@Injectable()
export class OrganizationsService {
  /**
   * Constructs the OrganizationsService and injects the OrganizationRepository.
   * The OrganizationRepository is a TreeRepository, which is a special type of
   * repository that supports hierarchical operations.
   * @param orgRepo The OrganizationRepository to be injected
   */
  constructor(
    @InjectRepository(Organization)
    private readonly orgRepo: TreeRepository<Organization>,
  ) {}

  /**
   * Creates a new organization. The organization is saved with the given name and description.
   * If a parentId is provided, the organization is saved as a child of the parent organization.
   * If the parent organization is not found, a NotFoundException is thrown.
   *
   * @param createOrgDto The data used to create the organization
   * @returns The newly created organization
   */
  async create(createOrgDto: CreateOrganizationDto): Promise<Organization> {
    const { name, description, parentId } = createOrgDto;

    const organization = this.orgRepo.create({
      name,
      description,
    });

    if (parentId) {
      const parentOrg = await this.orgRepo.findOne({ where: { id: parentId } });
      if (!parentOrg) {
        throw new NotFoundException('Parent organization not found');
      }
      organization.parent = parentOrg;
    }

    return await this.orgRepo.save(organization);
  }
}

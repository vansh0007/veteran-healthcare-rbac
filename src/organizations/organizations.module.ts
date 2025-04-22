import { Module } from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { OrganizationsController } from './organizations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organization } from 'src/entities/organization.entity';

@Module({
  controllers: [OrganizationsController],
  providers: [OrganizationsService],
  imports: [TypeOrmModule.forFeature([Organization])],
})
export class OrganizationsModule {}

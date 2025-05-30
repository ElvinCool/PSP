import { PartialType } from '@nestjs/mapped-types';
import { CreateCommunitiesDto } from './create-communities.dto';

export class UpdateCommunitiesDto extends PartialType(CreateCommunitiesDto) {}

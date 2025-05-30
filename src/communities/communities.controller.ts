import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { CommunitiessService } from './communities.service';
import { CreateCommunitiesDto } from './dto/create-communities.dto';
import { UpdateCommunitiesDto } from './dto/update-communities.dto';
import { Communities }  from './entities/communities.entity'

@Controller('communities')
export class CommunitiessController {
  constructor(private readonly CommunitiessService: CommunitiessService) {}

  @Post()
  create(@Body() createCommunitiesDto: CreateCommunitiesDto) {
    return this.CommunitiessService.create(createCommunitiesDto);
  }

  @Get()
  findAll(@Query('title') title?: string): Communities[] {
    return this.CommunitiessService.findAll(title);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.CommunitiessService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCommunitiesDto: UpdateCommunitiesDto) {
    return this.CommunitiessService.update(+id, updateCommunitiesDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.CommunitiessService.remove(+id);
  }
}

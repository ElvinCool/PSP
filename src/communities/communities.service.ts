import { Injectable } from '@nestjs/common';
import { CreateCommunitiesDto } from './dto/create-communities.dto';
import { UpdateCommunitiesDto } from './dto/update-communities.dto';
import { FileService } from 'src/file.service';
import { Communities } from './entities/communities.entity';

@Injectable()
export class CommunitiessService {
  constructor(private fileService: FileService<Communities[]>) {}

  findAll(title?: string): Communities[] {
    const Communitiess = this.fileService.read();

    return title
      ? Communitiess.filter((Communities) =>
          Communities.title.toLowerCase().includes(title.toLowerCase()),
        )
      : Communitiess;
  }
  create(createCommunitiesDto: CreateCommunitiesDto) {
    const Communitiess = this.fileService.read();

    const Communities = { ...createCommunitiesDto, id: Communitiess.length + 1 };

    this.fileService.add(Communities);
  }

  findOne(id: number): Communities | null {
    const Communitiess = this.fileService.read();

    return Communitiess.find((Communities) => Communities.id === id) ?? null;
  }

  update(id: number, updateCommunitiesDto: UpdateCommunitiesDto): void {
    const Communitiess = this.fileService.read();

    const updatedCommunitiess = Communitiess.map((Communities) =>
      Communities.id === id ? { ...Communities, ...updateCommunitiesDto } : Communities,
    );

    this.fileService.write(updatedCommunitiess);
  }

  remove(id: number): void {
    const filteredCommunitiess = this.fileService
      .read()
      .filter((Communities) => Communities.id !== id);

    this.fileService.write(filteredCommunitiess);
  }
}

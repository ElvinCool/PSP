import { Module } from '@nestjs/common';
import { CommunitiessService } from './communities.service';
import { CommunitiessController } from './communities.controller';
import { FileAccessor, FileService } from '../file.service';
import { Communities } from './entities/communities.entity';

export const Communities_FILE_PATH = 'Communities_FILE_PATH';

@Module({
  controllers: [CommunitiessController],
  providers: [
    CommunitiessService,
    {
      provide: FileService,
      useFactory: (Communities: CommunitiesModule) =>
        new FileService<Communities[]>(Communities.filePath),
      inject: [CommunitiesModule],
    },
  ],
})
export class CommunitiesModule implements FileAccessor {
  public readonly filePath = 'assets/Communities.json';
}
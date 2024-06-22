import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BackupsService } from './backups.service';
import { BackupsController } from './backups.controller';
import { Backup } from './entities/backup.entity';

@Module({
  controllers: [BackupsController],
  providers: [BackupsService],
  imports: [
    TypeOrmModule.forFeature([ Backup ]),
  ],
  exports: [
    BackupsService
  ]
})
export class BackupsModule {}

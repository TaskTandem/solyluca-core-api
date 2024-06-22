import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import * as moment from 'moment';
import { BackupsService } from '../backups/backups.service';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);
  
    constructor(
      private readonly backupService: BackupsService,
    ){}

  @Cron(CronExpression.EVERY_12_HOURS)
  createBackup() {
    this.backupService.writePostgresBackup();
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async deleteBackup() {
    const createdAtFrom = moment().subtract(3, 'days').format('YYYY-MM-DD') as unknown as Date; 
    const createdAtTo = moment().subtract(2, 'days').format('YYYY-MM-DD') as unknown as Date; 
    const backups = await this.backupService.findAll({ isDeleted: false, createdAtFrom, createdAtTo });
    for (const backup of backups) await this.backupService.remove( backup.id );
  }
}

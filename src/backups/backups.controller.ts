import { Controller, Get, Post, Body, Patch, Param, Delete, Res, Query } from '@nestjs/common';
import { Response } from 'express';
import { BackupsService } from './backups.service';
import { CreateBackupDto, UpdateBackupDto, FindBackuptDto } from './dto';

@Controller('backups')
export class BackupsController {
  constructor(private readonly backupsService: BackupsService) {}

  @Post()
  create() {
    return this.backupsService.writePostgresBackup();
  }

  @Get()
  findAll(
    @Query() findBackuptDto: FindBackuptDto,
  ) {
    return this.backupsService.findAll( findBackuptDto );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.backupsService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.backupsService.remove(id);
  }

  @Post('/download/:id')
  async getBackup(   
    @Param('id') id: string,
    @Res() res: Response
  ){
    try {
      const fileURL = await this.backupsService.getFileURL( id );
      res.contentType('application/pgsql');
      res.setHeader('Content-Disposition', `attachment; filename="backup.pgsql"`);
      return res.download(fileURL);
    } catch (error) {
      return res.status( 400 ).json({
        error,
      })
    }
  }
}

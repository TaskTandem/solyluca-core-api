import { Controller, Get, Post, Body, Patch, Param, Delete, Res, Query } from '@nestjs/common';
import { Response } from 'express';
import { BackupsService } from './backups.service';
import { FindBackuptDto } from './dto';
import { generateResponseObject } from 'src/common/helpers/transform-response.helper';

@Controller('backups')
export class BackupsController {
  constructor(private readonly backupsService: BackupsService) {}

  @Post()
  async create() {
    const backup = await this.backupsService.writePostgresBackup();
    return generateResponseObject( backup, 200, 'Backup created succesfully')
  }

  @Get()
  async findAll(
    @Query() findBackuptDto: FindBackuptDto,
  ) {
    const backups = await this.backupsService.findAll( findBackuptDto );
    return generateResponseObject( backups, 200 )
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const backup = await this.backupsService.findOne(id);
    return generateResponseObject( backup, 200 )
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const backupDeleted = await this.backupsService.remove(id);
    return generateResponseObject( backupDeleted, 200, 'Backup deleted succesfully' )
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

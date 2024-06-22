import { Injectable, Logger, BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { exec } from 'child_process';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import * as util from 'util';
import { Between, FindOptionsWhere, ILike, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { envs } from '../config/envs';
import { CreateBackupDto, FindBackuptDto, UpdateBackupDto } from './dto';
import { Backup } from './entities/backup.entity';

const execPromise = util.promisify(exec);

@Injectable()
export class BackupsService {
  private readonly logger = new Logger(BackupsService.name);

  constructor(
    @InjectRepository(Backup)
    private readonly backupRepository: Repository<Backup>,
  ){}

  async writePostgresBackup(){
    const backupDir = envs.backupsDirectory;
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFileName = `backup-${timestamp}.sql`;
    const backupFileURL = path.join(backupDir, backupFileName);
    let dumpCommand = `sudo docker exec ${envs.dbContainerName} pg_dump -U ${envs.dbUsername} ${envs.dbName} > ${backupFileURL}`;
    
    if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir, { recursive: true });
    
  
    if ( os.platform() === 'win32' ){
      dumpCommand = `docker exec ${envs.dbContainerName} pg_dump -U ${envs.dbUsername} ${envs.dbName} > ${backupFileURL}`;
    }

    process.env.PGPASSWORD = envs.dbPassword;
    
    await execPromise(dumpCommand);
    
    const backup = await this.create({
      name: backupFileName,
      path: backupDir,
      type: 'POSTGRESQL',
      description: `Backup generated on ${ new Date().toISOString() }`,
      isDeleted: false
    })

    console.log(`Backup successful: ${backupFileURL}`);

    return backup;
  }

  async downloadBackup(){

  }

  async create(createBackupDto: CreateBackupDto) {
    try {
      const newBackup = this.backupRepository.create({ ...createBackupDto });
      await this.backupRepository.save( newBackup );
      return newBackup;
    } catch (error) {
      this.handleDBError( error );
    }

  }

  async findAll( findBackupDto: FindBackuptDto ) {
    try {
      const backups = await this.backupRepository.find({
        where: this.getWhereClause( findBackupDto ),
      });
      return backups;
    } catch (error) {
      this.handleDBError( error );
    }
  }

  async findOne(id: string) {
    try {
      const backup = await this.backupRepository.findOne({ where: { id }});
      if ( !backup ) throw new NotFoundException(`Backup ${ id } does not exists`);
      return backup;
    } catch (error) {
      this.handleDBError( error );
    }
  }

  async getFileURL( backupId: string ){
    const backup = await this.findOne( backupId );
    return `${ backup.path }/${ backup.name }`;
  }

  async update(id: string, updateBackupDto: UpdateBackupDto) {
    try {
      await this.backupRepository.update(id, {
        ...updateBackupDto,
        id
      });
  
      const backup = await this.findOne( id );
  
      return backup;
    } catch (error) {
      this.handleDBError( error );
    }

  }

  async remove(id: string) {
    try {
      const backup = await this.findOne( id );
      const finalPath = `${ backup.path }/${ backup.name }`;
      await fs.promises.unlink( finalPath );
      await this.update( id, { isDeleted: true });
      return true;
    } catch (error) {
      this.handleDBError( error );
    }
  }


  private handleDBError( error: any ){
    console.log(error);
    if (error.code === '23505') throw new BadRequestException(error.detail);
    this.logger.error(error);
    
    if ( !error.message ) throw new InternalServerErrorException(`Unexpected error, check server logs`);
    else throw new InternalServerErrorException(error.message)
  }

  private getWhereClause( findBackupDto: FindBackuptDto ){
    let where: FindOptionsWhere<Backup> = { };
    if ( findBackupDto.description ) where = { ...where, description: ILike(`%${ findBackupDto.description }%`) };
    if ( findBackupDto.id ) where = { ...where, id: findBackupDto.id };
    if ( findBackupDto.name ) where = { ...where, name: ILike(`%${ findBackupDto.name }%`) };
    if ( findBackupDto.path ) where = { ...where, path: ILike(`%${ findBackupDto.path }%`) };
    if ( findBackupDto.type ) where = { ...where, type: ILike(`%${ findBackupDto.type }%`) };
    if ( typeof findBackupDto.isDeleted === 'boolean' ) where = { ...where, isDeleted: findBackupDto.isDeleted };
    if ( findBackupDto.createdAtFrom ) where = { ...where, createdAt: MoreThanOrEqual(findBackupDto.createdAtFrom) };
    if ( findBackupDto.createdAtTo ) where = { ...where, createdAt: LessThanOrEqual(findBackupDto.createdAtTo) };
    if ( findBackupDto.createdAtFrom && findBackupDto.createdAtTo ) where = { ...where, createdAt: Between(findBackupDto.createdAtFrom, findBackupDto.createdAtTo) }
    return where;
  }
}

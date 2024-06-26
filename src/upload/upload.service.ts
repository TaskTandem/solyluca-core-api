import { Injectable } from '@nestjs/common';
import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { v4 as uuid } from 'uuid';
import * as mime from 'mime-types';
import { envs } from '../config/envs';
import { CreateUploadDto, UpdateUploadDto } from './dto';

@Injectable()
export class UploadService {
  private readonly s3Client = new S3Client({
    region: envs.awsS3Region
  });

  async uploadSeveral( files: Express.Multer.File[], routeS3: string ){
    const urls = [];

    for (const file of files) {
      const url = await this.upload( file, routeS3 );
      urls.push( url);
    }

    return urls;
  }

  async upload( file: Express.Multer.File, routeS3: string ){
    const fileName = this.generateKey( file, routeS3 );

    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: envs.awsS3BucketName,
        Key: fileName,
        Body: file.buffer,
        ContentType: file.mimetype
      })
    );

    const imageUrl = `https://${envs.awsS3BucketName}.s3.${envs.awsS3Region}.amazonaws.com/${ fileName }`;

    return imageUrl;
  }

  private generateKey( file: Express.Multer.File, routeS3: string ){
    const index = file.originalname.lastIndexOf('.') + 1;
    const extension = file.originalname.slice(index);
    const now = Date.now();
    const random = Math.floor(Math.random() * 999)
    const key = `${routeS3}/${uuid()}-${now}-${random}.${extension}`;
    return key;
  }

  async delete( imageUrl: string, route: string ) {
    const index = imageUrl.search(route);
    const imageS3 = imageUrl.slice( index, imageUrl.length );


    await this.s3Client.send(
      new DeleteObjectCommand({ 
        Bucket: envs.awsS3BucketName, 
        Key: imageS3 
      })
    );

    return true;
  }
}

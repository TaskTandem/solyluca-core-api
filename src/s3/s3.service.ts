import { Injectable } from '@nestjs/common';
import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { v4 as uuid } from 'uuid';
import { envs } from '../config/envs';
import * as path from 'path';
import * as fs from 'fs';
import { convertBufferToWebp } from '../common/helpers/compress-image.helper';

@Injectable()
export class S3Service {
  private readonly s3Client = new S3Client({
    region: envs.awsS3Region
  });

  async uploadSeveral( files: Express.Multer.File[], routeS3: string ){
    const urls = [];

    for (const file of files) {
      const url = await this.upload( file, routeS3 );
      urls.push( url );
    }

    return urls;
  }

  async upload( file: Express.Multer.File, routeS3: string ){
    const extension = this.getExtension( file );
    const { inputPath, outputPath, tempDir} = await convertBufferToWebp( file.buffer, extension );
    const newMimeType = 'image/webp';
    const fileName = this.generateKey( file, routeS3, 'webp' );

    const finalBuffer = await fs.promises.readFile(outputPath);
    await fs.promises.unlink(inputPath).catch(() => {});
    await fs.promises.unlink(outputPath).catch(() => {});
    await fs.promises.rmdir(tempDir).catch(() => {});

    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: envs.awsS3BucketName,
        Key: fileName,
        Body: finalBuffer,
        // ContentType: file.mimetype
        ContentType: newMimeType
      })
    );

    const imageUrl = `https://${envs.awsS3BucketName}.s3.${envs.awsS3Region}.amazonaws.com/${ fileName }`;

    return imageUrl;
  }

  private generateKey( file: Express.Multer.File, routeS3: string, newExtension?: string ){
    const extension = newExtension || this.getExtension( file );
    const now = Date.now();
    const random = Math.floor(Math.random() * 999)
    const key = `${routeS3}/${uuid()}-${now}-${random}.${extension}`;
    return key;
  }

  getExtension( file: Express.Multer.File ){
    const index = file.originalname.lastIndexOf('.') + 1;
    const extension = file.originalname.slice(index);
    return extension;
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

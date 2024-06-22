import { Controller, Post, UseInterceptors, UploadedFile, ParseFilePipe } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { generateResponseObject } from 'src/common/helpers/transform-response.helper';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post()
  @UseInterceptors( FileInterceptor('file') )
  async uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
        ],
      }),
    )
    file: Express.Multer.File
  ){
    const imageUrl = await this.uploadService.upload( file, 'products' );
    return generateResponseObject( { imageUrl }, 200 );
  }
}

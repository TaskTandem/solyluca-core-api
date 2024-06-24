import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseInterceptors, UploadedFile, ParseFilePipe, UploadedFiles } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto, UpdateProductDto, FindProductDto, RemoveImageProductDto } from './dto';
import { generateResponseObject } from 'src/common/helpers/transform-response.helper';
import { PaginationDto } from '../common/dto/pagination.dto';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { Product } from './entities/product.entity';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  async create(@Body() createProductDto: CreateProductDto) {
    const product = await this.productsService.create(createProductDto);
    return generateResponseObject( product, 200, 'Product created succesfully' );
  }

  @Get()
  async findAll(
    @Query() findProductDto: FindProductDto,
    @Query() paginationDto: PaginationDto
  ) {
    const products = await this.productsService.findAll(findProductDto);
    let count = null;
    if ( paginationDto.count ) count = await this.productsService.count( findProductDto );
    return generateResponseObject( { products, count }, 200 );
  }

  @Post('uploadImage/:id')
  @UseInterceptors( FileInterceptor('file') )
  async uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
        ],
      }),
    )
    file: Express.Multer.File,
    @Param('id') id: string
  ){
    const product = await this.productsService.uploadImage( id, file );
    return generateResponseObject( product, 200 );
  }

  @Post('uploadImages/:id')
  @UseInterceptors( FilesInterceptor('files') )
  async uploadFiles(
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
        ],
      }),
    )
    files: Express.Multer.File[],
    @Param('id') id: string
  ){
    const product = await this.productsService.uploadImages( id, files );
    return generateResponseObject( product, 200 );
  }

  @Delete('removeImage')
  async removeImage(
    @Body() removeImageProductDto: RemoveImageProductDto
  ){
    const product = await this.productsService.removeImage( removeImageProductDto );
    return generateResponseObject( product, 200 ); 
  }

  @Get('byCategory/:categoryId')
  async getAllByCategory(
    @Param('categoryId') categoryId: string,
    @Query() findProductDto: FindProductDto,
  ){
    const products = await this.productsService.findAllByCategoryId( categoryId, findProductDto );
    return generateResponseObject( products, 200 ); 
  }


  @Get(':id')
  async findOne(@Param('id') id: string) {
    const product = await this.productsService.findOne(id);
    return generateResponseObject( product, 200 );
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    const product = await this.productsService.update(id, updateProductDto);
    return generateResponseObject( product, 200 );
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const productDeleted = await this.productsService.remove(id);
    return generateResponseObject( productDeleted, 200 );
  }

}

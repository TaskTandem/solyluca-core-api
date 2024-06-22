import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto, UpdateProductDto, FindProductDto } from './dto';
import { generateResponseObject } from 'src/common/helpers/transform-response.helper';
import { PaginationDto } from '../common/dto/pagination.dto';

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

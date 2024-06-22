import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto, FindCategoryDto, UpdateCategoryDto } from './dto';
import { generateResponseObject } from 'src/common/helpers/transform-response.helper';
import { PaginationDto } from '../common/dto/pagination.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    const category = await this.categoriesService.create(createCategoryDto);
    return generateResponseObject( category, 200, 'Category created succesfully');
  }

  @Get()
  async findAll(
    @Query() findCategoryDto: FindCategoryDto,
    @Query() paginationDto: PaginationDto
    ) {
    const categories = await this.categoriesService.findAll(findCategoryDto);
    let count = null;
    if ( paginationDto.count ) count = await this.categoriesService.count( findCategoryDto );
    return generateResponseObject( categories, 200 );
  }

  @Get(':id')
  async findOne(@Param('id') id: string) { 
    const category = await this.categoriesService.findOneOrFail(id);
    return generateResponseObject( category, 200 );
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    const category = await this.categoriesService.update(id, updateCategoryDto);
    return generateResponseObject( category, 200 );
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const categoryDeleted = await this.categoriesService.remove(id);
    return generateResponseObject( categoryDeleted, 200, 'Category deleted succesfully' );
  }
}

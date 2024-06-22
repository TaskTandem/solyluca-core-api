import { Injectable, Logger, BadRequestException, InternalServerErrorException, NotFoundException, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository, Like, IsNull, ILike, In } from 'typeorm';

import { CreateCategoryDto, UpdateCategoryDto, FindCategoryDto } from './dto';
import { Category } from './entities/category.entity';
import { PaginationDto } from '../common/dto';
import { ProductCategoryService } from '../product-category/product-category.service';

@Injectable()
export class CategoriesService {
  private readonly logger = new Logger('CategoriesService');
    
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    private readonly productCategoryService: ProductCategoryService,
    private readonly dataSource: DataSource,

  ){}

  async create(createCategoryDto: CreateCategoryDto) {
    try {
      await this.validate( createCategoryDto );
      const category = this.categoryRepository.create(createCategoryDto);
      await this.categoryRepository.save( category );
      return category;
    } catch (error) {
      this.handleDBError(error);
    }
  }

  async findAll( findCategoryDto: FindCategoryDto) {
    try {
      const categories = await this.categoryRepository.find({
        where: this.getWhereClause( findCategoryDto ),

      });
      return categories;
    } catch (error) {
      this.handleDBError(error);
    }
  }

  async findAllMain( findCategoryDto: FindCategoryDto ){
    try {
      const categories = await this.categoryRepository.find({
        where: {
          ...this.getWhereClause( findCategoryDto ),
          parentId: IsNull()
        },
        relations: ['childrens'],
        order: {
          name: 'ASC',
        }
      });
      return categories;
    } catch (error) {
      this.handleDBError(error);
    }
  }


  async findOne( id: string) {
    try {
      const category = await this.categoryRepository.findOne({ 
        where: { id }
      });
      return category;
    } catch (error) {
      this.handleDBError(error);
    }
  }

  async findOneOrFail( id: string) {
    try {
      const category = await this.categoryRepository.findOne({ 
        where: { id }
      });

      if ( !category ) throw new NotFoundException(`Category ${ id } does not exists`);

      return category;
    } catch (error) {
      this.handleDBError(error);
    }
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    try {
      await this.categoryRepository.update(id, {
        ...updateCategoryDto,
        id
      });

      const category = await this.findOneOrFail( id );
  
      return category;
    } catch (error) {
      this.handleDBError(error);
    }
  }

  async remove(id: string) {
    try {
      await this.productCategoryService.deleteAllByCategoryId( id );
      // await this.categoryRepository.delete({ id });
      await this.update( id, { isDeleted: true });
      return true;
    } catch (error) {
      this.handleDBError(error);
    }
  }

  async rehabilitate(id: string) {
    try {
      await this.categoryRepository.update(id, {
        isAvailable: true,
        isDeleted: false
      });

      return true;
    } catch (error) {
      this.handleDBError(error);
    }
  }

  private async validate( createCategoryDto: CreateCategoryDto ){
    const exists = await this.categoryRepository.findOne({
      where: {
        name: createCategoryDto.name,
        parentId: createCategoryDto.parentId,
      }
    });

    if ( exists ) throw new BadRequestException(`Already exist an category with name ${ createCategoryDto.name } and parentId ${ createCategoryDto.parentId }`)
    
    return true;
  }

  private getWhereClause( findCategoryDto: FindCategoryDto ){
    let where = { };
    if ( findCategoryDto.description ) where = { ...where, description: ILike(`%${ findCategoryDto.description }%`) };
    if ( findCategoryDto.id ) where = { ...where, id: findCategoryDto.id };
    if ( findCategoryDto.ids ) where = { ...where, id: In(findCategoryDto.ids) };
    if ( typeof findCategoryDto.isAvailable === 'boolean' ) where = { ...where, isAvailable: findCategoryDto.isAvailable };
    if ( typeof findCategoryDto.isDeleted === 'boolean' ) where = { ...where, isDeleted: findCategoryDto.isDeleted };
    if ( findCategoryDto.name ) where = { ...where, name: ILike(`%${ findCategoryDto.name }%`) };
    if ( findCategoryDto.parentId ) where = { ...where, parentId: findCategoryDto.parentId };
    if ( findCategoryDto.parentId === null ) where = { ...where, parentId: IsNull() };
    return where;
  }

  private buildCategoryTree(categories: Category[]): Category[] {
    let tree: Category[] = [];
    let lookup: { [key: number]: Category } = {};

    categories.forEach(category => {
      lookup[category.id] = category;
      category.childrens = [];
    });

    categories.forEach(category => {
      if (category.parentId) lookup[category.parentId].childrens.push(category);
      else tree.push(category); 
    });

    return tree;
  }


  private handleDBError( error: any ){
    console.log(error);

    if (error instanceof HttpException ) throw error; 
    if (error.code === '23505') throw new BadRequestException( error.detail );
    if (error.code === '22P02') throw new BadRequestException( error.message );
    
    this.logger.error(error);
    if ( !error.message ) throw new InternalServerErrorException(`Unexpected error, check server logs`);
    throw new InternalServerErrorException(error.message)
  }
}

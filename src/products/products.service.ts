import { Injectable, Logger, NotFoundException, HttpException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, FindOptionsWhere, ILike, In } from 'typeorm';

import { CreateProductDto, UpdateProductDto, FindProductDto } from './dto';
import { Product } from './entities/product.entity';
import { ProductCategoryService } from '../product-category/product-category.service';
import { Category } from '../categories/entities/category.entity';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger('ProductsService');

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    private readonly productCategoryService: ProductCategoryService,

    private readonly dataSource: DataSource,

  ){}

  async create(createProductDto: CreateProductDto) {
    try {
      const { categoriesIds = [], ...productDetails } = createProductDto;
      
      const product = this.productRepository.create({
        ...productDetails, 
      });
  
      await this.productRepository.save( product );
      
  
      const productsCategories = await this.productCategoryService.createSeveral( product.id, categoriesIds )
  
      return { ...product, productsCategories };
    } catch (error) {
      this.handleDBError( error );
    }
  }

  async findAll( findProductDto: FindProductDto ) {
    try {
      const { categoriesIds = null , ...findProductDtoData } = findProductDto;
      let productsIds = [];
  
      if ( categoriesIds && categoriesIds.length > 0 ){
        for (const categoryId of categoriesIds ) {
          const productsCategories = await this.productCategoryService.findAllByCategoryId( categoryId )
          productsIds.push( ...productsCategories.map( productCategory => productCategory.productId ) );
        }
      }
  
      const products = await this.productRepository.find({
        where: this.getWhereClause({ ...findProductDtoData, ids: productsIds }),
      })
  
      return products;
    } catch (error) {
      this.handleDBError( error );
    }
  }

  async findOne(id: string) {
    try {
      const product = await this.productRepository.findOne({
        where: { id },
        relations: {
          categories: true
        }
      });
  
      const finalCategories = this.buildCategoryTree( product.categories );
      
      return { ...product, categories: finalCategories };
    } catch (error) {
      this.handleDBError( error );
    }
  }

  async findOneOrFail(id: string) {
    try {
      const product = await this.productRepository.findOne({
        where: { id },
        relations: {
          categories: true
        }
      });
  
      if ( !product ) throw new NotFoundException(`Product with id ${ id } and filters sended not found`);
  
      const finalCategories = this.buildCategoryTree( product.categories );
      
      return { ...product, categories: finalCategories };
    } catch (error) {
      this.handleDBError( error );
    }
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    try {
      const { categoriesIds = [], ...dataToUpdate } = updateProductDto;

      await this.productRepository.update(id, {
        ...dataToUpdate,
        id
      });
  
      await this.productCategoryService.deleteAllByProductId( id );
  
      await this.productCategoryService.createSeveral( id, categoriesIds )
  
      const product = await this.findOne( id );
  
      return product;
    } catch (error) {
      this.handleDBError( error );
    }
  }

  async remove(id: string) {
    try {
      await this.productCategoryService.deleteAllByProductId( id );
      await this.productRepository.delete({ id });
      return true;
    } catch (error) {
      this.handleDBError( error );
    }
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

  private getWhereClause( findProductDto: FindProductDto ){
    let where: FindOptionsWhere<Product> = { };
    if ( findProductDto.description ) where = { ...where, description: ILike(`%${ findProductDto.description }%`) };
    if ( findProductDto.id ) where = { ...where, id: findProductDto.id };
    if ( findProductDto.ids ) where = { ...where, id: In(findProductDto.ids) };
    if ( findProductDto.name ) where = { ...where, name: ILike(`%${ findProductDto.name }%`) };
    if ( findProductDto.price ) where = { ...where, price: findProductDto.price };
    if ( findProductDto.promotionalPrice ) where = { ...where, promotionalPrice: findProductDto.promotionalPrice };
    if ( findProductDto.stock ) where = { ...where, stock: findProductDto.stock };
    if ( typeof findProductDto.isAvailable === 'boolean' ) where = { ...where, isAvailable: findProductDto.isAvailable };
    if ( typeof findProductDto.isDeleted === 'boolean' ) where = { ...where, isDeleted: findProductDto.isDeleted };

    return where;
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

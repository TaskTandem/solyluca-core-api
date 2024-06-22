import { Injectable, Logger } from '@nestjs/common';
import { validate as isUUID } from 'uuid';

import { BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { ProductCategory } from './entities/product-category.entity';
import { Product } from '../products/entities/product.entity';

@Injectable()
export class ProductCategoryService {
    private readonly logger = new Logger('ProductCategoryService');
    
    constructor(
        @InjectRepository(ProductCategory)
        private readonly productCategoryRepository: Repository<ProductCategory>,
        private readonly dataSource: DataSource,
    ){}


    async create(){

    }

    async createSeveral( productId: string, categoryIds: string[] ): Promise<ProductCategory[]>{
        const productsCategories: ProductCategory[] = [];
        try {

            for (const categoryId of categoryIds) {
                if ( ! await this.findOne( productId, categoryId ) ){
                    const productCategory = this.productCategoryRepository.create({
                        productId,
                        categoryId
                    });
                
                    await this.productCategoryRepository.save( productCategory );
    
                    productsCategories.push( productCategory );
                }
            }

            return productsCategories;
        } catch (error) {
            for (const productCategory of productsCategories) await this.productCategoryRepository.remove( productCategory )
            this.handleDBError( error );
        } 
    }

    async findAllByCategoryId( categoryId: string ): Promise<ProductCategory[]> {
        try {
            const productsCategories = await this.productCategoryRepository.find({
                where: { categoryId },
            });
            return productsCategories;
        } catch (error) {
            this.handleDBError( error );     
        }

    }

    async findAllProductsByCategoryId( categoryId: string ): Promise<Product[]>{
        try {
            const productsCategories = await this.productCategoryRepository.find({
                where: { categoryId },
                relations: {
                    product: true
                }
            });
            const products: Product[] = [];
            
            // const products: Product[] = productsCategories.map( productCategory => productCategory.products );

            productsCategories.forEach( productCategory => {
                products.push( productCategory.product )
            });
            return products;
        } catch (error) {
            this.handleDBError( error );     
        }
    }

    async findAllByCategoriesByProductId( productId: string ){

    }


    async findOne( productId: string, categoryId: string): Promise<ProductCategory>{
        try {
            const productCategory = await this.productCategoryRepository.findOne({ where: { productId, categoryId }} );
            return productCategory;
        } catch (error) {
            this.handleDBError( error );
        }
    }

    async findOneThrowError( productId: string, categoryId: string): Promise<ProductCategory>{
        const productCategory = await this.productCategoryRepository.findOne({ where: { productId, categoryId }} );
        if ( !productCategory ) throw new NotFoundException(`ProductCategory with productId ${ productId } and categoryId ${ categoryId } not found`)
        return productCategory;
    }
    
    
    async deleteAllByProductId( productId: string ){
        await this.productCategoryRepository.delete({ productId });
    }

    async deleteAllByCategoryId( categoryId: string ){
        await this.productCategoryRepository.delete({ categoryId });
    }

    private handleDBError( error: any ){
        console.log(error);
        if (error.code === '23505') throw new BadRequestException(error.detail);
        
        this.logger.error(error);
        if ( !error.message ) throw new InternalServerErrorException(`Unexpected error, check server logs`);
        else throw new InternalServerErrorException(error.message)
    }
}
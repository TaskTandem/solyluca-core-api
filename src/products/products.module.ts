import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ProductCategoryModule } from '../product-category/product-category.module';
import { S3Module } from '../s3/s3.module';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
  imports: [
    TypeOrmModule.forFeature([ Product ]),
    ProductCategoryModule,
    S3Module,
  ],
})
export class ProductsModule {}

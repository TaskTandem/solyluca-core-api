import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductCategory } from './entities/product-category.entity';
import { ProductCategoryService } from './product-category.service';

@Module({
  providers: [ ProductCategoryService ],
  exports: [ ProductCategoryService ],
  imports: [ TypeOrmModule.forFeature([ ProductCategory ]) ],
})
export class ProductCategoryModule {}

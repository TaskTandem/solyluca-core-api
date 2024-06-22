import { Entity, ManyToOne, PrimaryColumn, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from '../../products/entities/product.entity';
import { Category } from "../../categories/entities/category.entity";

@Entity('product_category')
export class ProductCategory {
    // @PrimaryGeneratedColumn('uuid')
    // id: string;

    @PrimaryColumn()
    productId: string;
  
    @PrimaryColumn()
    categoryId: string;
  
    @ManyToOne(
      () => Product,
      product => product.categories,
      {onDelete: 'NO ACTION', onUpdate: 'NO ACTION'}
    )
    @JoinColumn([{ name: 'productId', referencedColumnName: 'id' }])
    product: Product;
  
    @ManyToOne(
      () => Category,
      category => category.products,
      { onDelete: 'NO ACTION', onUpdate: 'NO ACTION' }
    )
    @JoinColumn([{ name: 'categoryId', referencedColumnName: 'id' }])
    category: Category;
}

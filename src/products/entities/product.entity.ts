import { Category } from '../../categories/entities/category.entity';
import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToMany, JoinTable, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'products' })
export class Product {

    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column('text', {
        unique: false,
    })
    name: string;

    @Column('float', {
        default: null,
        nullable: true,
    })
    price: number;

    @Column('float', {
        default: null,
        nullable: true
    })
    promotionalPrice: number;

    @Column({
        type: 'text',
        nullable: true
    })
    description: string;

    @Column('int', {
        default: 9999
    })
    stock: number;

    @Column('text', {
        array: true,
        default: []
    })
    images: string[];

    @Column('boolean', {
        default: true,
    })
    isAvailable: boolean;

    @Column('boolean', {
        default: false,
    })
    isDeleted: boolean;

    @Column('date', {
        default: new Date(),
    })
    createdAt: Date;

    @Column('date', {
        default: new Date(),
    })
    updatedAt: Date;

    @ManyToMany(
        () => Category, 
        category => category.products,
        { onDelete: 'NO ACTION', onUpdate: 'NO ACTION' }
    )
    @JoinTable({
        name: 'product_category',
        joinColumn: {
            name: 'productId',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'categoryId',
            referencedColumnName: 'id',
        },
    })
    categories?: Category[];


    @BeforeUpdate()
    checkSlugUpdate(){ 
        this.updatedAt = new Date();
    }

}

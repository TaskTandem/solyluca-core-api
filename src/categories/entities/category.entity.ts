import { BeforeUpdate, Column, Entity, PrimaryGeneratedColumn, ManyToMany, JoinTable, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Product } from '../../products/entities/product.entity';

@Entity({ name: 'categories' })
export class Category {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: true })
    parentId: string | null;

    @Column('text', {
        unique: false,
    })
    name: string;

    @Column({
        type: 'text',
        nullable: true
    })
    description: string;

    @Column('boolean', {
        default: true,
    })
    isAvailable: boolean;

    @Column('boolean', {
        default: false,
    })
    isDeleted: boolean;

    @Column('text', {
        array: true,
        default: []
    })
    images?: string[];

    @Column('date', {
        default: new Date(),
    })
    createdAt: Date;

    @Column('date', {
        default: new Date(),
    })
    updatedAt: Date;

    @ManyToOne(() => Category, category => category.childrens)
    @JoinColumn({ name: "parentId" })
    parent: Category | null;

    @OneToMany(() => Category, category => category.parent)
    childrens: Category[];

    @ManyToMany(
        () => Product,
        product => product.categories,
        { onDelete: 'NO ACTION', onUpdate: 'NO ACTION' },
    )
    @JoinTable({
        name: 'product_category',
        joinColumn: {
            name: 'categoryId',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'productId',
            referencedColumnName: 'id',
        },
    })
    products?: Product[];

    @BeforeUpdate()
    checkUpdate(){ 
        this.updatedAt = new Date();
    }
}
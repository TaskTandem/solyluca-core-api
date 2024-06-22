import { BeforeUpdate, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'backups' })
export class Backup {

    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column('text', {
        unique: true,
    })
    name: string;

    @Column({
        type: 'text',
        nullable: false
    })
    path: string;

    @Column({
        type: 'text',
        nullable: false
    })
    type: string;

    @Column({
        type: 'text',
        nullable: true
    })
    description: string;

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

    @BeforeUpdate()
    checkSlugUpdate(){ 
        this.updatedAt = new Date();
    }
}

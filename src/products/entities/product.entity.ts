import { User } from "src/auth/entities/user.entity";
import { BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductImage } from ".";




@Entity('products')
export class Product {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @Column('text', { unique: true })
    title: string;

    @Column('float', { default: 0 })
    price: number

    @Column({ type: 'text', nullable: true })
    description: string

    @Column({ type: 'text', unique: true })
    slug: string

    @Column({ type: 'int', default: 0 })
    stock: number

    @Column('text', { array: true })
    sizes: string[]

    @Column('text')
    gender: string;

    @Column('text', {
        array: true,
        default: []
    }
    )
    tags: string[];
    //tags
    //images
    @OneToMany(() => ProductImage, (productImage) => productImage.product, { cascade: true, eager: true } )
    images?: ProductImage[];

    @ManyToOne(() => User, (user) => user.product, { eager: true, cascade: true }) user: User;

    @BeforeUpdate()
    checkSlugUpdate() {

        this.slug = this.slug
            .toLowerCase()
            .replaceAll(' ', '_')
            .replaceAll("'", '');
    }

    // @BeforeUpdate(){
    //     if (!this.slug) {
    //         this.slug = this.title;
    //     }

    //     this.slug = this.slug
    //         .toLowerCase()
    //         .replaceAll(' ', '_')
    //         .replaceAll("'", '')
    // }

    checkSlugInsert() {
        if (!this.slug) {
            this.slug = this.title;
        }

        this.slug = this.slug
            .toLowerCase()
            .replaceAll(' ', '_')
            .replaceAll("'", '')
    }



}

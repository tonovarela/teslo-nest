import { ApiProperty } from "@nestjs/swagger";
import { User } from "src/auth/entities/user.entity";
import { BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductImage } from ".";




@Entity('products')
export class Product {
    @ApiProperty({example:"e271328e-2c8a-4de5-bb8d-32fe5cc7124e",description:"Product Id",uniqueItems:true})
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @Column('text', { unique: true })
    title: string;
    @ApiProperty()
    @Column('float', { default: 0 })
    price: number
    @ApiProperty()
    @Column({ type: 'text', nullable: true })
    description: string
    @ApiProperty()
    @Column({ type: 'text', unique: true })
    slug: string
    @ApiProperty()
    @Column({ type: 'int', default: 0 })
    stock: number
    @ApiProperty()
    @Column('text', { array: true })
    sizes: string[]
    @ApiProperty()
    @Column('text')
    gender: string;
    @ApiProperty()
    @Column('text', {
        array: true,
        default: []
    }
    )
    tags: string[];
    //tags
    //images
    @ApiProperty()
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

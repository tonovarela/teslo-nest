import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { DataSource, QueryResult, Repository, ReturningStatementNotSupportedError } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { PaginationDTO } from 'src/common/dto/pagination.dto';

import { validate as isUUID } from 'uuid';
import { ProductImage } from './entities/product-image.entity';


@Injectable()
export class ProductsService {
  private readonly logger = new Logger('ProductsService');

  constructor(@InjectRepository(Product) private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductImage) private readonly producImagetRepository: Repository<ProductImage>,
    private readonly dataSource: DataSource
  ) { }
  async create(createProductDto: CreateProductDto) {
    const { images = [], ...productDetails } = createProductDto;
    try {
      const producto = this.productRepository.create({ ...productDetails, images: images.map(image => this.producImagetRepository.create({ url: image })) });
      await this.productRepository.save(producto);
      return { ...producto, images: images };
    }
    catch (error) {
      this.handleExceptions(error);
    }
  }

  async findAll(paginationDTO: PaginationDTO) {
    const { limit = 50, offset = 0 } = paginationDTO;
    const products = await this.productRepository.find({
      take: limit, skip: offset,
      relations: {
        images: true
      }
    })
    return products.map(p => ({ ...p, images: p.images.map(i => i.url) }));

  }

  async findOne(term: string) {
    let product: Product;
    if (isUUID(term)) {
      product = await this.productRepository.findOneBy({ id: term })
    } else {
      const queryBuilder = this.productRepository.createQueryBuilder();
      product = await queryBuilder.where("lower(title)=:title or slug=:slug", { title: term.toLowerCase(), slug: term.toLowerCase() })
        //.leftJoinAndSelect('prod.images','prodImages')
        .getOne();
    }
    if (!product)
      throw new NotFoundException(`Product with ${term} not found`);
    //return product;
    return { ...product, images: product.images?.map(i => i.url) || [] };

  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const { images, ...toUpdate } = updateProductDto;
    const product = await this.productRepository.preload({ id, ...toUpdate })
    if (!product)
      throw new NotFoundException(`Product with ${id} not found`);
    const queryRunner = this.dataSource.createQueryRunner();
    try {

      await queryRunner.connect();
      await queryRunner.startTransaction();
      if (images) {
        await queryRunner.manager.delete(ProductImage, { product: { id } });
        product.images = images.map(image => this.producImagetRepository.create({ url: image }));
      } else {
        product.images = await this.producImagetRepository.findBy({ product: { id } });

      }
      await queryRunner.manager.save(product);

      await queryRunner.commitTransaction();
      await queryRunner.release();
      return product;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      this.handleExceptions(error);
    }    

  }
  async remove(id: string) {
    const { affected } = await this.productRepository.delete({ id })
    if (!affected)
      throw new NotFoundException("Product not found");
    return {
      msg: "Product deleted"
    }
  }

  private handleExceptions(error: any) {
    this.logger.error(error);
    if (error.code === '23505')
      throw new BadRequestException(error.detail);
    throw new InternalServerErrorException(error)
  }

  async deleteAllProducts(){
    const query= this.producImagetRepository.createQueryBuilder('product');
    try {
      return await query.delete().where({}).execute()
    }catch(error){
     this.handleExceptions(error);
    }
    
  }
}

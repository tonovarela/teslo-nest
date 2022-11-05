import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { PaginationDTO } from 'src/common/dto/pagination.dto';

import { validate as isUUID } from 'uuid';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger('ProductsService');
  constructor(@InjectRepository(Product) private readonly productRepository: Repository<Product>) {


  }
  async create(createProductDto: CreateProductDto) {
    try {
      const producto = this.productRepository.create(createProductDto);
      await this.productRepository.save(producto);
      return producto;
    }
    catch (error) {
      this.handleExceptions(error);
    }
  }

  async findAll(paginationDTO: PaginationDTO) {
    const { limit = 10, offset = 0 } = paginationDTO;
    return await this.productRepository.find({
      take: limit, skip: offset
      //Cargar relaciones
    })
  }

  async findOne(term: string) {
    let product: Product;
    if (isUUID(term)) {
      product = await this.productRepository.findOneBy({ id: term })
    } else {
      const queryBuilder = this.productRepository.createQueryBuilder();
      product = await queryBuilder.where("lower(title)=:title or slug=:slug", {title:term.toLowerCase(),slug:term.toLowerCase()}).getOne();      
    }    
    if (!product)
      throw new NotFoundException(`Product with ${term} not found`);
    return product

  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    //  const product = await this.productRepository.preload({id,...updateProductDto})
    //  if (!product)
    //   throw new NotFoundException(`Product with ${id} not found`);

    //   return this.productRepository.save(product);

    const { affected } = await this.productRepository.update({ id }, updateProductDto);
    if (affected == 0)
      throw new NotFoundException("Product not found");
    return { msg: "Product successfully updated" }




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
}

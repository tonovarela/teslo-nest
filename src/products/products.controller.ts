import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiResponse } from '@nestjs/swagger';


import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

import { PaginationDTO } from 'src/common/dto/pagination.dto';
import { ValidRoles } from 'src/auth/interfaces';
import { Auth } from './../auth/decorators/auth.decorator';
import { GetUser } from 'src/auth/decorators';
import { User } from 'src/auth/entities/user.entity';
import { Product } from './entities';
@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @ApiResponse({status:201,description:"Producto creado",type:Product})
  @ApiResponse({status:401,description:"No autorizado"})
  @ApiResponse({status:400,description:"Bad  request"})  
  @Auth(ValidRoles.user)  
  @Post()
  create(@Body() createProductDto: CreateProductDto,@GetUser() user:User) {
    return this.productsService.create(createProductDto,user);
  }
  
  @Get()
  findAll(@Query() paginationDTO:PaginationDTO) {
    
    return this.productsService.findAll(paginationDTO);
  }

  @Get(':term')
  findOne(@Param('term') term: string) {
    return this.productsService.findOne(term);
  }
  @Auth(ValidRoles.user)  
  @Patch(':id')
  update(@Param('id',ParseUUIDPipe) id: string, @Body() updateProductDto: UpdateProductDto,@GetUser() user:User ) {
    return this.productsService.update(id, updateProductDto,user);
  }
  @Auth(ValidRoles.user)  
  @Delete(':id')
  remove(@Param('id',ParseUUIDPipe) id: string) {
    return this.productsService.remove(id);
  }
}

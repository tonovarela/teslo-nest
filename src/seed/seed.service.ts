import {  Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt'
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';
import { Repository } from 'typeorm';
import { ProductsService } from '../products/products.service';
import { initialData } from './data/seed-data';




@Injectable()
export class SeedService {


  constructor(private productsService: ProductsService,    
    @InjectRepository(User) private readonly userRepository: Repository<User>) {}
  async runSeed() {
    await this.deleteTables();
   const user=  await this.insertUsers();
    await this.insertNewProducts(user);
    return 'SEED EXECUTED'
  }

  private async deleteTables() {
    await this.productsService.deleteAllProducts();
    const queryBuilder = this.userRepository.createQueryBuilder();
    await queryBuilder.delete().where({}).execute();
  }


  private async insertUsers(){
    const seedUsers= initialData.users;


    const users:User[] =[];
    seedUsers.forEach(user=>{
      user.password= bcrypt.hashSync(user.password, 10) 
      users.push(this.userRepository.create(user));
    })

    await this.userRepository.save(users);    
    return users[0];

  }

  private async insertNewProducts(user:User) {
    await this.productsService.deleteAllProducts();

    const products = initialData.products;
    const insertPromises = [];
    products.forEach(product => insertPromises.push(this.productsService.create(product,user)));
    await Promise.all(insertPromises);

    return true;

  }


}

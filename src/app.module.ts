import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ProductsModule } from './products/products.module';
import { CommonModule } from './common/common.module';
import { getConfigDB } from 'src/configDB';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedModule } from './seed/seed.module';

@Module({
  imports: [ConfigModule.forRoot(),
  TypeOrmModule.forRoot(getConfigDB()),
    ProductsModule,
    CommonModule,
    SeedModule],
  controllers: [],
  providers: [],
})
export class AppModule {
  constructor() {
  }
}

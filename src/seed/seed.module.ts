import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { ProductsModule } from '../products/products.module';
import { ProductsService } from '../products/products.service';

@Module({
  controllers: [SeedController,],
  imports:[ProductsModule],
  providers: [SeedService]
})
export class SeedModule {}

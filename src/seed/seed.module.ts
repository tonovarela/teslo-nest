import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { ProductsModule } from '../products/products.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [SeedController,],
  imports:[ProductsModule,AuthModule],
  providers: [SeedService]
})
export class SeedModule {}

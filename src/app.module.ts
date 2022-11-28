import { Module} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ProductsModule } from './products/products.module';
import { CommonModule } from './common/common.module';
import { getConfigDB } from 'src/configDB';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedModule } from './seed/seed.module';
import { FilesModule } from './files/files.module';
import { ServeStaticModule } from '@nestjs/serve-static';

import { join } from 'path';

@Module({
  imports: [ConfigModule.forRoot(),
  TypeOrmModule.forRoot(getConfigDB()),   
    ProductsModule,
    CommonModule,
    SeedModule,
    FilesModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname,'..',"public") ,
    })
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  constructor() {
  }
}

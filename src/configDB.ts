import { TypeOrmModuleOptions } from "@nestjs/typeorm";

export function getConfigDB(): TypeOrmModuleOptions  {
  return {
    type: 'postgres',
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    autoLoadEntities: true,
    synchronize: true
  }
}

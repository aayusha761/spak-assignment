import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'root',
  password: 'root',
  database: 'spak',
  entities: [__dirname + '/../db/entities/**{.ts,.js}'],
  // entities : [__dirname + '/../../app/db/entities/**{.ts, .js}'],
  synchronize: true,
};

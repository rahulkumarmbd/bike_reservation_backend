import { SqliteConnectionOptions } from 'typeorm/driver/sqlite/SqliteConnectionOptions';

const config: SqliteConnectionOptions = {
  type: 'sqlite',
  database: 'database.db',
  entities: ['dist/src/**/*.js'],
  synchronize:true
};

export default config;
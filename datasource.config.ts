import { DataSource, DataSourceOptions } from "typeorm";
import * as dotenv from 'dotenv';

dotenv.config()

const base64 = process.env.DB_CA_CERTIFICATE;
// console.log(Buffer.from(base64, 'base64').toString('utf-8'))
console.log(process.env.DB_USER)
const config = {
      type: 'postgres',
    //   url: process.env.DB_URI,
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      ssl: {
        rejectUnauthorized: false,
        ca: Buffer.from(base64, 'base64').toString('utf-8')},
      entities: ['src/entities/*.entity.ts'],
      migrations: ['src/migrations/*.ts'],
}

export const connectionSource = new DataSource(config as DataSourceOptions)
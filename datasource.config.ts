import { DataSource, DataSourceOptions } from "typeorm";
import * as dotenv from 'dotenv';

dotenv.config()

const certbase64 = process.env.DB_CA_CERTIFICATE;
const config = {
      type: 'postgres',
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      ssl: {
        rejectUnauthorized: false,
        ca: Buffer.from(certbase64, 'base64').toString('utf-8')},
      entities: ['src/entities/*.entity.ts'],
      migrations: ['src/migrations/*.ts'],
}

export const connectionSource = new DataSource(config as DataSourceOptions)
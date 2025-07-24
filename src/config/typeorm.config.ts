import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { join } from 'path';
import { EnvService } from './env.service';
import { NodeEnvironment } from 'src/validation/env.validation';
 
@Injectable()
export class PostgreSQLConfigService implements TypeOrmOptionsFactory {
  constructor(private envService: EnvService) {

  } 

  createTypeOrmOptions(): TypeOrmModuleOptions { 
    
    const certificate = this.envService.dbCaCertificate;
    let options = {
      type: 'postgres', 
      
      host: this.envService.dbHost,
      port: +this.envService.dbPort,
      username: this.envService.dbUser,
      password: this.envService.dbPassword,
      database: this.envService.dbName,
      entities:  [__dirname + '/../**/*.entity{.ts,.js}'],
      synchronize: this.envService.nodeEnv === NodeEnvironment.Development ? true : false,
      autoLoadEntities: true,
      migrations: [join(__dirname, '**', '*.migration.{ts,js}')], 
    } as TypeOrmModuleOptions
    if (this.envService.nodeEnv === "production") {
      options["ssl"] = {
        rejectUnauthorized: false,
        ca: Buffer.from(certificate, 'base64').toString('utf-8')}
    }

    return options;
  }
}

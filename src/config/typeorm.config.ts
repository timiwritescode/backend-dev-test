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
    
    
    return {
      type: 'postgres', 
      url: this.envService.dbURI,
      entities:  [__dirname + '/../**/*.entity{.ts,.js}'],
      synchronize: this.envService.nodeEnv === NodeEnvironment.Development ? true : false,
      autoLoadEntities: true,
      migrations: [join(__dirname, '**', '*.migration.{ts,js}')], 
    };
  }
}

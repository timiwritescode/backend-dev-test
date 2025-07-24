import { Module } from '@nestjs/common';
import { AuthModule } from './api/auth/auth.module';
import { UserModule } from './api/user/user.module';
import { EnvModule } from './config/env.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostgreSQLConfigService } from './config/typeorm.config';
import { CompanyModule } from './api/company/company.module';
import { AdminModule } from './api/admin/admin.module';


@Module({
  imports: [
    EnvModule,
    TypeOrmModule.forRootAsync({
      useClass: PostgreSQLConfigService,
      inject: [PostgreSQLConfigService]
    }),
    AuthModule, 
    UserModule,
    CompanyModule,
    AdminModule]
})
export class AppModule {}

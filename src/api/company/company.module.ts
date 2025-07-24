import { Module } from '@nestjs/common';
import { CompanyController } from './company.controller';
import { CompanyService } from './company.service';
import { FirebaseAdmin } from 'src/config/firebase.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from 'src/entities/company.entity';
import { User } from 'src/entities/user.entity';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Company, User]),
    UserModule
  ],
  controllers: [CompanyController],
  providers: [CompanyService, FirebaseAdmin]
})
export class CompanyModule {}

import { Module } from '@nestjs/common';
import { AdminUsersController } from './users/admin.user.controller';
import { FirebaseAdmin } from 'src/config/firebase.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Company } from 'src/entities/company.entity';
import { AdminUsersService } from './users/admin.user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Company])
  ],
  providers: [FirebaseAdmin, AdminUsersService],
  controllers: [AdminUsersController]
})
export class AdminModule {}

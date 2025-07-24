import { Module } from '@nestjs/common';
import { AdminUsersController } from './users/admin.user.controller';
import { FirebaseAdmin } from 'src/config/firebase.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Company } from 'src/entities/company.entity';
import { AdminUsersService } from './users/admin.user.service';
import { AwsService } from 'src/aws/aws.service';
import { Image } from 'src/entities/image.entity';
import { AdminImageController } from './images/admin.image.controller';
import { AdminImageService } from './images/admin.image.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Company, Image])
  ],
  providers: [FirebaseAdmin, 
    AdminUsersService, 
    AdminImageService,
    AwsService],
  controllers: [AdminUsersController, AdminImageController]
})
export class AdminModule {}

import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { FirebaseAdmin } from 'src/config/firebase.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User])
  ],
  providers: [UserService, FirebaseAdmin],
  controllers: [UserController],
  exports: [UserService]
})
export class UserModule {}

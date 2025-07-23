import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { FirebaseAdmin } from 'src/config/firebase.config';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/persistence/schemas/user.schema';

@Module({
  imports: [MongooseModule.forFeature([{name: User.name, schema: UserSchema}])],
  providers: [UserService, FirebaseAdmin],
  controllers: [UserController],
  exports: [UserService]
})
export class UserModule {}

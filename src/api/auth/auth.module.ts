import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { FirebaseService } from './firebase.service';
import { FirebaseAdmin } from 'src/config/firebase.config';

@Module({
  imports: [UserModule],
  providers: [AuthService, FirebaseService, FirebaseAdmin],
  controllers: [AuthController]
})
export class AuthModule {}

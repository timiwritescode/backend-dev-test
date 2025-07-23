import { Module } from '@nestjs/common';
import { MongooseModule } from "@nestjs/mongoose"
import { AuthModule } from './api/auth/auth.module';
import { UserModule } from './api/user/user.module';
import { EnvModule } from './config/env.module';
import { EnvService } from './config/env.service';


@Module({
  imports: [
    EnvModule,
    MongooseModule.forRootAsync({
      inject: [EnvService],
      useFactory: (envService: EnvService) => ({
        uri: envService.mongoURI,
      }),
    }),
    AuthModule, 
    UserModule]
})
export class AppModule {}

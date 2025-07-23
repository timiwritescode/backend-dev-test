import { Global, Module } from "@nestjs/common";
import { EnvService } from "./env.service";
import * as admin from 'firebase-admin';


@Global()
@Module({
    providers: [
        {   inject: [EnvService],
            provide: 'FIREBASE_ADMIN',
            useFactory: (envService: EnvService) => {
                const base64 = envService.fireBaseServiceAccount64;
                const serviceAccount = JSON.parse(
                    Buffer.from(base64, 'base64').toString('utf-8'),
                );

                return admin.credential.cert(serviceAccount);
            }
        }
    ],

    exports: ['FIREBASE_ADMIN'],
})  
export class FirebaseAdminModule {}
import { Injectable, OnApplicationBootstrap } from "@nestjs/common";
import * as admin from "firebase-admin";
import { EnvService } from "./env.service";

let app: admin.app.App = null;


@Injectable()
export class FirebaseAdmin implements OnApplicationBootstrap {
    constructor(private readonly envService: EnvService) {}
    
    async onApplicationBootstrap() {
        if (!app) {
            const base64 = this.envService.fireBaseServiceAccount64;
            
            const serviceAccount = JSON.parse(
                    Buffer.from(base64, 'base64').toString('utf-8'),
                );
            
            app = admin.initializeApp({
                credential: admin.credential.cert(serviceAccount)
            })
        }        
    }


    getFirebaseApp() {
        return app;
    }
}   
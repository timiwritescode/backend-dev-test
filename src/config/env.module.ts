import { Global, Module } from "@nestjs/common";
import { validate } from "./validate-env";
import { EnvService } from "./env.service";
import * as dotenv from "dotenv";

dotenv.config()

@Global()
@Module({
    providers: [
        {
            provide: "ENV_OBJECT",
            useValue: validate(process.env),
        },
        {
            provide: EnvService,
            useFactory: (env: any) => new EnvService(env),
            inject: ["ENV_OBJECT"],
        }
    ],

    exports: [EnvService]
})
export class EnvModule {} 
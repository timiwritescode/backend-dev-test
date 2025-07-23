import { Injectable } from "@nestjs/common";
import { EnvironmentVariables } from "src/validation/env.validation";



@Injectable()
export class EnvService {
    constructor(private readonly env: EnvironmentVariables) {}


    get nodeEnv() {
        return this.env.NODE_ENV;
    }

    get port() {
        return +this.env.PORT;
    }


    get mongoURI() {
        return this.env.MONGO_URI;
    }
}
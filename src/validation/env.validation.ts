import { IsBase64, IsEnum, IsNotEmpty, IsNumberString, IsString, Matches } from "class-validator";

export enum NodeEnvironment {
    Development = "development",
    Production = "production"
}

export class EnvironmentVariables {
    @IsEnum(NodeEnvironment)
    NODE_ENV: NodeEnvironment;

    @IsNotEmpty()
    @IsString() 
    DB_URI: string;
   

    @IsNumberString()
    @IsNotEmpty()
    PORT: string;

    @IsNotEmpty()
    @IsBase64()
    FIREBASE_SERVICE_ACCOUNT_B64: string;

    @IsNotEmpty()
    @IsString()
    FIREBASE_API_KEY: string;

    @IsNotEmpty()
    @IsString()
    FIREBASE_EMAIL_AND_PASSWORD_SIGNIN_URL: string;
}